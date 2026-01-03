<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use App\Models\Ingredient;
use App\Http\Requests\StoreStockMovementRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with('ingredient');

        // Filters
        if ($request->has('ingredient_id')) {
            $query->where('ingredient_id', $request->ingredient_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('start_date')) {
            $query->where('movement_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('movement_date', '<=', $request->end_date);
        }

        $movements = $query->orderBy('movement_date', 'desc')
                           ->orderBy('id', 'desc')
                           ->get();

        return response()->json([
            'success' => true,
            'data' => $movements
        ]);
    }

    public function store(StoreStockMovementRequest $request)
    {
        DB::beginTransaction();
        try {
            // Create movement record
            $movement = StockMovement::create($request->validated());

            // Update ingredient stock
            $ingredient = Ingredient::find($request->ingredient_id);
            $ingredient->updateStock($request->quantity, $request->type);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock movement recorded successfully',
                'data' => $movement->load('ingredient')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to record stock movement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(StockMovement $stockMovement)
    {
        return response()->json([
            'success' => true,
            'data' => $stockMovement->load('ingredient')
        ]);
    }

    public function destroy(StockMovement $stockMovement)
    {
        DB::beginTransaction();
        try {
            // Reverse the stock movement
            $ingredient = $stockMovement->ingredient;
            $reverseType = $stockMovement->type === 'IN' ? 'OUT' : 'IN';
            $ingredient->updateStock($stockMovement->quantity, $reverseType);

            // Delete the movement
            $stockMovement->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock movement deleted and stock reversed successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete stock movement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function recentMovements(Ingredient $ingredient, Request $request)
    {
        $limit = $request->get('limit', 10);

        $movements = $ingredient->stockMovements()
            ->orderBy('movement_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $movements
        ]);
    }
}
