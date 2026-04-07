<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AdminOverviewService;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Return a compact operational overview for the admin dashboard.
     */
    public function __invoke(AdminOverviewService $overviewService): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $overviewService->getDashboardData(),
        ]);
    }
}
