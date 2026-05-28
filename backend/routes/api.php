<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PurchaseOrderController;

// --- common API Routes ---
Route::post('/auth/login', [AuthController::class, 'login']);

// --- Safe API Routes (It is mandotory to be logged in) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Logout process
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Products Module Routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products/store', [ProductController::class, 'store']);
    Route::get('/products/low-stock', [ProductController::class, 'lowStockAlerts']);

    // Inventory Stock In/Out Routes
    Route::post('/inventory/transaction', [InventoryController::class, 'logTransaction']);

    // Purchase Order Routes
    Route::post('/purchase-orders/store', [PurchaseOrderController::class, 'store']);
});
