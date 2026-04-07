<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthAPIController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminNotificationsController;
use App\Http\Controllers\Api\DetailsAPIController;
use App\Http\Controllers\Api\ProductAPIController;
use App\Http\Controllers\Api\PromotionAPIController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\PublicMenuController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ContactAPIController;

// ============================================
// PUBLIC CUSTOMER API ROUTES (No Auth Required)
// ============================================
Route::prefix('public')->group(function () {
    Route::get('details', [DetailsAPIController::class, 'publicLatest']);

    // Menu & Categories
    Route::get('categories', [PublicMenuController::class, 'categories']);
    Route::get('menu-items', [PublicMenuController::class, 'menuItems']);
    Route::get('menu-items/{id}', [PublicMenuController::class, 'showMenuItem']);
    Route::get('featured-items', [PublicMenuController::class, 'featuredItems']);

    // Gallery (Public - active images only)
    Route::get('gallery', [GalleryController::class, 'publicIndex']);

    // Contact Us (Public - customer submission)
    Route::post('contact', [ContactAPIController::class, 'store']);
});

// ============================================
// ADMIN API ROUTES (Auth Required)
// ============================================

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthAPIController::class, 'login'])->name('admin.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AdminAuthAPIController::class, 'logout'])->name('admin.logout');
        Route::get('profile', [AdminAuthAPIController::class, 'profile'])->name('admin.profile');
        Route::put('profile', [AdminAuthAPIController::class, 'updateProfile'])->name('admin.updateProfile');

        // Dashboard
        Route::get('dashboard', AdminDashboardController::class)->name('admin.dashboard');
        Route::get('notifications', AdminNotificationsController::class)->name('admin.notifications');

        // Shop Details Management
        Route::apiResource('details', DetailsAPIController::class);

        // Product Management
        Route::apiResource('products', ProductAPIController::class);

        // Promotion Management
        Route::apiResource('promotions', PromotionAPIController::class);

        // Category Management
        Route::apiResource('categories', CategoryController::class);

        // Menu Item Management
        Route::apiResource('menu-items', MenuItemController::class);

        // Gallery Management
        Route::apiResource('gallery', GalleryController::class);
        Route::patch('gallery/{id}/toggle-active', [GalleryController::class, 'toggleActive'])->name('admin.gallery.toggleActive');

        // Contact Messages Management
        Route::apiResource('contact-messages', ContactAPIController::class)->only(['index', 'show', 'destroy']);
    });
});
