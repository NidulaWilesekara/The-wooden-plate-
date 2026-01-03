<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;
use Throwable;

class PromotionAPIController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Promotion::query();

            if ($request->filled('search')) {
                $s = $request->string('search')->toString();
                $query->where(function ($q) use ($s) {
                    $q->where('title', 'like', "%{$s}%")
                      ->orWhere('code', 'like', "%{$s}%");
                });
            }

            if ($request->filled('active')) {
                // Accept: 1/0, true/false
                $active = filter_var($request->active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($active !== null) {
                    $query->where('is_active', $active);
                }
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('valid_now') && filter_var($request->valid_now, FILTER_VALIDATE_BOOLEAN)) {
                $now = now();
                $query->where(function ($q) use ($now) {
                    $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
                })->where(function ($q) use ($now) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
                });
            }

            $promotions = $query->orderByDesc('created_at')->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $promotions
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load promotions.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function store(StorePromotionRequest $request)
    {
        try {
            $promotion = Promotion::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Promotion created successfully.',
                'data' => $promotion
            ], 201);
        } catch (QueryException $e) {
            // DB errors like duplicate unique etc.
            return response()->json([
                'success' => false,
                'message' => 'Database error while creating promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function show(Promotion $promotion)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $promotion
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion)
    {
        try {
            $promotion->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Promotion updated successfully.',
                'data' => $promotion
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error while updating promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function destroy(Promotion $promotion)
    {
        try {
            $promotion->delete();

            return response()->json([
                'success' => true,
                'message' => 'Promotion deleted successfully.'
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete promotion.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
