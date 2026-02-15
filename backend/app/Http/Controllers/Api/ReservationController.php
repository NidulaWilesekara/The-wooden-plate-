<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use App\Models\Reservation;
use App\Mail\ReservationConfirmedMail;
use App\Mail\ReservationCancelledMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

        // Send email notification based on status change
        try {
            if ($newStatus === 'confirmed' && $reservation->customer && $reservation->customer->email) {
                Mail::to($reservation->customer->email)->send(new ReservationConfirmedMail($reservation));
            } elseif ($newStatus === 'cancelled' && $reservation->customer && $reservation->customer->email) {
                Mail::to($reservation->customer->email)->send(new ReservationCancelledMail($reservation, $request->admin_notes));
            }
        } catch (\Exception $e) {
            // Log email error but don't fail the status update
            \Log::error('Failed to send reservation email: ' . $e->getMessage());
        }

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

    /**
     * Store a reservation from public form (requires customer auth token)
     */
    public function publicStore(Request $request): JsonResponse
    {
        // Validate request
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'party_size' => 'required|integer|min:1|max:20',
            'reservation_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_notes' => 'nullable|string|max:1000',
        ]);

        // Calculate duration and validate max 3 hours
        $start = \Carbon\Carbon::createFromFormat('H:i', $validated['start_time']);
        $end = \Carbon\Carbon::createFromFormat('H:i', $validated['end_time']);
        $durationMinutes = $start->diffInMinutes($end);

        if ($durationMinutes > 180) { // 3 hours max
            return response()->json([
                'success' => false,
                'message' => 'Maximum reservation duration is 3 hours'
            ], 422);
        }

        // Check if table is available
        $table = \App\Models\Table::find($validated['table_id']);
        if (!$table->isAvailable($validated['reservation_date'], $validated['start_time'], $validated['end_time'])) {
            return response()->json([
                'success' => false,
                'message' => 'This table is not available for the selected time slot'
            ], 422);
        }

        // Get or create customer
        $customer = null;
        if ($request->user()) {
            $customer = $request->user();
        } else {
            // Try to find existing customer by email
            $customer = \App\Models\Customer::where('email', $validated['customer_email'])->first();

            if (!$customer) {
                // Create guest customer record
                $customer = \App\Models\Customer::create([
                    'name' => $validated['customer_name'],
                    'email' => $validated['customer_email'],
                    'phone' => $validated['customer_phone'],
                ]);
            }
        }

        // Create reservation
        $reservation = Reservation::create([
            'customer_id' => $customer->id,
            'table_id' => $validated['table_id'],
            'party_size' => $validated['party_size'],
            'reservation_date' => $validated['reservation_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'status' => 'pending',
            'customer_notes' => $validated['customer_notes'] ?? null,
        ]);

        $reservation->load(['table', 'customer']);

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully. You will receive a confirmation email shortly.',
            'data' => $reservation
        ], 201);
    }
}
