<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AdminOverviewService;
use Illuminate\Http\JsonResponse;

class AdminNotificationsController extends Controller
{
    public function __invoke(AdminOverviewService $overviewService): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $overviewService->getNotificationsData(),
        ]);
    }
}
