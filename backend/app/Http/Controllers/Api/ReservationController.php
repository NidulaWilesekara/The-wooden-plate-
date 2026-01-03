<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display customer's reservations
     */
    public function customerIndex(Request $request): JsonResponse
    {
        $customerId = $request->user()->id;

        $reservations = Reservation::with(['table'])
            ->where('customer_id', $customerId)
            ->orderBy('reservation_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    /**
     * Display admin view of all reservations
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Reservation::with(['customer', 'table']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->where('reservation_date', $request->date);
        }

        // Filter by table
        if ($request->has('table_id')) {
            $query->where('table_id', $request->table_id);
        }

        // Search by customer name
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $reservations = $query->orderBy('reservation_date', 'desc')
                              ->orderBy('start_time', 'desc')
                              ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    /**
     * Store a new reservation (Customer booking)
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['customer_id'] = $request->user()->id;
        $data['status'] = 'pending';

        $reservation = Reservation::create($data);
        $reservation->load(['table', 'customer']);

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully. Waiting for admin confirmation.',
            'data' => $reservation
        ], 201);
    }

    /**
     * Display a specific reservation
     */
    public function show(Request $request, $id): JsonResponse
    {
        $reservation = Reservation::with(['customer', 'table'])->findOrFail($id);

        // Check if customer is authorized to view this reservation
        $user = $request->user();
        if ($user->id !== $reservation->customer_id && !$user->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    /**
     * Update reservation status (Admin only)
     */
    public function updateStatus(UpdateReservationStatusRequest $request, $id): JsonResponse
    {
        $reservation = Reservation::with(['customer', 'table'])->findOrFail($id);

        $newStatus = $request->status;

        // Validate status transitions
        if ($newStatus === 'confirmed' && !$reservation->canBeConfirmed()) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending reservations can be confirmed'
            ], 400);
        }

        if ($newStatus === 'cancelled' && !$reservation->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'This reservation cannot be cancelled'
            ], 400);
        }

        $reservation->update([
            'status' => $newStatus,
            'admin_notes' => $request->admin_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation status updated successfully',
            'data' => $reservation
        ]);
    }

    /**
     * Cancel reservation (Customer can cancel their own)
     */
    public function cancel(Request $request, $id): JsonResponse
    {
        $reservation = Reservation::findOrFail($id);

        // Check authorization
        $user = $request->user();
        if ($user->id !== $reservation->customer_id && !$user->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$reservation->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'This reservation cannot be cancelled'
            ], 400);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Reservation cancelled successfully',
            'data' => $reservation
        ]);
    }

    /**
     * Get pending reservations count (for dashboard notification)
     */
    public function pendingCount(): JsonResponse
    {
        $count = Reservation::pending()->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
}
