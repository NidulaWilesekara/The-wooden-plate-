<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class PublicMenuController extends Controller
{
    /**
     * Get all active categories
     */
    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'image']);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get menu items (with optional category filter)
     */
    public function menuItems(Request $request)
    {
        $query = MenuItem::with('category:id,name')
            ->where('is_available', true);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $menuItems = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $menuItems
        ]);
    }

    /**
     * Get single menu item details
     */
    public function showMenuItem($id)
    {
        $menuItem = MenuItem::with('category')
            ->where('is_available', true)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $menuItem
        ]);
    }

    /**
     * Get featured/popular items
     */
    public function featuredItems()
    {
        $items = MenuItem::where('is_available', true)
            ->where('is_featured', true) // You can add this column later
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}
