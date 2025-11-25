<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthAPIController;


Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthAPIController::class, 'login'])->name('admin.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AdminAuthAPIController::class, 'logout'])->name('admin.logout');
        Route::get('profile', [AdminAuthAPIController::class, 'profile'])->name('admin.profile');
        Route::put('profile', [AdminAuthAPIController::class, 'updateProfile'])->name('admin.updateProfile');
        // Add dashboard route here if needed
        Route::get('dashboard', function () {
            return response()->json(['message' => 'Welcome to Admin Dashboard']);
        })->name('admin.dashboard');
    });
});