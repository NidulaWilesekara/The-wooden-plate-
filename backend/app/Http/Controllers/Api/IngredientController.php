<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index(Request $request)
    {
        $query = Ingredient::with('stockMovements');

        // Filters
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->has('low_stock') && $request->low_stock) {
            $query->lowStock();
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $ingredients = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $ingredients
        ]);
    }

    public function store(StoreIngredientRequest $request)
    {
        $ingredient = Ingredient::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Ingredient created successfully',
            'data' => $ingredient->load('stockMovements')
        ], 201);
    }

    public function show(Ingredient $ingredient)
    {
        return response()->json([
            'success' => true,
            'data' => $ingredient->load('stockMovements')
        ]);
    }

    public function update(UpdateIngredientRequest $request, Ingredient $ingredient)
    {
        $ingredient->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Ingredient updated successfully',
            'data' => $ingredient->load('stockMovements')
        ]);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ingredient deleted successfully'
        ]);
    }

    public function lowStock()
    {
        $ingredients = Ingredient::lowStock()
            ->active()
            ->orderBy('current_stock', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $ingredients->count(),
            'data' => $ingredients
        ]);
    }
}
