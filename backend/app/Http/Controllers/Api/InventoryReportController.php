<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventoryReportController extends Controller
{
    /**
     * Monthly Inventory Dashboard
     */
    public function monthlyDashboard(Request $request)
    {
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('m'));

        // Date ranges
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();
        $today = Carbon::now();

        // KPIs
        $totalIngredients = Ingredient::active()->count();
        $lowStockCount = Ingredient::active()->lowStock()->count();

        // Get all ingredients with movements
        $ingredients = Ingredient::active()
            ->with([
                'stockMovements' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('movement_date', [$startDate, $endDate]);
                }
            ])
            ->get();

        $inventoryData = [];

        foreach ($ingredients as $ingredient) {
            // Calculate opening stock (stock at start of month)
            $openingStock = $this->calculateOpeningStock($ingredient, $startDate);

            // Current month movements
            $stockIn = $ingredient->stockMovements->where('type', 'IN')->sum('quantity');
            $stockOut = $ingredient->stockMovements->where('type', 'OUT')->sum('quantity');

            // Closing stock (current stock)
            $closingStock = $ingredient->current_stock;

            // Average monthly usage (last 3 months)
            $avgUsage = $this->calculateAverageUsage($ingredient->id, 3);

            // Suggested purchase
            $suggestedPurchase = max(0, $avgUsage - $closingStock);

            $inventoryData[] = [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'unit' => $ingredient->unit,
                'opening_stock' => round($openingStock, 2),
                'stock_in' => round($stockIn, 2),
                'stock_out' => round($stockOut, 2),
                'closing_stock' => round($closingStock, 2),
                'reorder_level' => $ingredient->reorder_level,
                'needs_reorder' => $closingStock <= $ingredient->reorder_level,
                'avg_monthly_usage' => round($avgUsage, 2),
                'suggested_purchase' => round($suggestedPurchase, 2),
                'supplier_name' => $ingredient->supplier_name,
                'supplier_contact' => $ingredient->supplier_contact,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'period' => [
                    'year' => $year,
                    'month' => $month,
                    'month_name' => $startDate->format('F Y'),
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ],
                'kpis' => [
                    'total_ingredients' => $totalIngredients,
                    'low_stock_count' => $lowStockCount,
                    'ingredients_needing_reorder' => collect($inventoryData)->where('needs_reorder', true)->count(),
                ],
                'inventory' => $inventoryData,
            ]
        ]);
    }

    /**
     * Usage Analysis (for specific ingredient)
     */
    public function usageAnalysis(Request $request, $ingredientId)
    {
        $ingredient = Ingredient::findOrFail($ingredientId);
        $months = $request->get('months', 6); // Last 6 months by default

        $usageData = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $year = $date->year;
            $month = $date->month;

            $stockOut = StockMovement::where('ingredient_id', $ingredientId)
                ->where('type', 'OUT')
                ->forMonth($year, $month)
                ->sum('quantity');

            $stockIn = StockMovement::where('ingredient_id', $ingredientId)
                ->where('type', 'IN')
                ->forMonth($year, $month)
                ->sum('quantity');

            $usageData[] = [
                'period' => $date->format('M Y'),
                'year' => $year,
                'month' => $month,
                'stock_in' => round($stockIn, 2),
                'stock_out' => round($stockOut, 2),
            ];
        }

        // Calculate averages
        $avgMonthlyUsage = collect($usageData)->avg('stock_out');
        $avgMonthlyPurchase = collect($usageData)->avg('stock_in');

        return response()->json([
            'success' => true,
            'data' => [
                'ingredient' => [
                    'id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'unit' => $ingredient->unit,
                    'current_stock' => $ingredient->current_stock,
                    'reorder_level' => $ingredient->reorder_level,
                ],
                'usage_trend' => $usageData,
                'averages' => [
                    'avg_monthly_usage' => round($avgMonthlyUsage, 2),
                    'avg_monthly_purchase' => round($avgMonthlyPurchase, 2),
                ],
                'suggestion' => [
                    'suggested_order' => max(0, round($avgMonthlyUsage - $ingredient->current_stock, 2)),
                    'days_remaining' => $avgMonthlyUsage > 0
                        ? round(($ingredient->current_stock / $avgMonthlyUsage) * 30, 1)
                        : null,
                ]
            ]
        ]);
    }

    /**
     * Stock valuation (if prices are added later)
     */
    public function stockValuation()
    {
        $ingredients = Ingredient::active()
            ->select('id', 'name', 'unit', 'current_stock')
            ->orderBy('name')
            ->get();

        $totalItems = $ingredients->count();
        $totalStockValue = 0; // Can be calculated if unit_price is added to ingredients table

        return response()->json([
            'success' => true,
            'data' => [
                'total_ingredients' => $totalItems,
                'total_stock_value' => $totalStockValue,
                'ingredients' => $ingredients,
            ]
        ]);
    }

    /**
     * Helper: Calculate opening stock at start of month
     */
    private function calculateOpeningStock($ingredient, $startDate)
    {
        // Current stock minus all movements since start of month
        $currentStock = $ingredient->current_stock;

        $movementsSince = StockMovement::where('ingredient_id', $ingredient->id)
            ->where('movement_date', '>=', $startDate)
            ->get();

        foreach ($movementsSince as $movement) {
            if ($movement->type === 'IN') {
                $currentStock -= $movement->quantity;
            } else {
                $currentStock += $movement->quantity;
            }
        }

        return max(0, $currentStock);
    }

    /**
     * Helper: Calculate average monthly usage (last N months)
     */
    private function calculateAverageUsage($ingredientId, $months = 3)
    {
        $totalUsage = 0;

        for ($i = 1; $i <= $months; $i++) {
            $date = Carbon::now()->subMonths($i);

            $usage = StockMovement::where('ingredient_id', $ingredientId)
                ->where('type', 'OUT')
                ->forMonth($date->year, $date->month)
                ->sum('quantity');

            $totalUsage += $usage;
        }

        return $totalUsage / $months;
    }

    /**
     * Purchase suggestions for all low-stock items
     */
    public function purchaseSuggestions()
    {
        $ingredients = Ingredient::active()->lowStock()->get();

        $suggestions = [];

        foreach ($ingredients as $ingredient) {
            $avgUsage = $this->calculateAverageUsage($ingredient->id, 3);
            $suggestedQty = max(0, $avgUsage - $ingredient->current_stock);

            if ($suggestedQty > 0) {
                $suggestions[] = [
                    'id' => $ingredient->id,
                    'name' => $ingredient->name,
                    'unit' => $ingredient->unit,
                    'current_stock' => $ingredient->current_stock,
                    'reorder_level' => $ingredient->reorder_level,
                    'avg_monthly_usage' => round($avgUsage, 2),
                    'suggested_quantity' => round($suggestedQty, 2),
                    'supplier_name' => $ingredient->supplier_name,
                    'supplier_contact' => $ingredient->supplier_contact,
                    'priority' => $ingredient->current_stock == 0 ? 'CRITICAL' : 'LOW',
                ];
            }
        }

        return response()->json([
            'success' => true,
            'count' => count($suggestions),
            'data' => $suggestions
        ]);
    }
}
