<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TableController extends Controller
{
    /**
     * Display a listing of tables
     */
    public function index(Request $request): JsonResponse
    {
        $query = Table::query()->withCount('reservations');

        // Search by table number
        if ($request->has('search')) {
            $query->where('table_number', 'like', '%' . $request->search . '%');
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by minimum chair count
        if ($request->has('min_chairs')) {
            $query->where('chair_count', '>=', $request->min_chairs);
        }

        $tables = $query->orderBy('table_number', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $tables
        ]);
    }

    /**
     * Store a newly created table
     */
    public function store(StoreTableRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_active'] = $data['is_active'] ?? true;

        $table = Table::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Table created successfully',
            'data' => $table
        ], 201);
    }

    /**
     * Display the specified table
     */
    public function show(Table $table): JsonResponse
    {
        $table->load(['reservations' => function ($query) {
            $query->upcoming()->with('customer');
        }]);

        return response()->json([
            'success' => true,
            'data' => $table
        ]);
    }

    /**
     * Update the specified table
     */
    public function update(UpdateTableRequest $request, Table $table): JsonResponse
    {
        $table->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Table updated successfully',
            'data' => $table
        ]);
    }

    /**
     * Remove the specified table
     */
    public function destroy(Table $table): JsonResponse
    {
        // Check if table has upcoming reservations
        $hasUpcoming = $table->reservations()
            ->upcoming()
            ->exists();

        if ($hasUpcoming) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete table with upcoming reservations'
            ], 400);
        }

        $table->delete();

        return response()->json([
            'success' => true,
            'message' => 'Table deleted successfully'
        ]);
    }

    /**
     * Get available tables for a specific date and time
     */
    public function available(Request $request): JsonResponse
    {
        $request->validate([
            'reservation_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'party_size' => 'required|integer|min:1',
        ]);

        $tables = Table::active()
            ->where('chair_count', '>=', $request->party_size)
            ->get()
            ->filter(function ($table) use ($request) {
                return $table->isAvailable(
                    $request->reservation_date,
                    $request->start_time,
                    $request->end_time
                );
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $tables
        ]);
    }
}
