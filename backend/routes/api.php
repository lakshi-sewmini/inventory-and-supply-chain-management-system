<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\SupportTicketController;
use App\Http\Controllers\API\SettingController;

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::put('/support-tickets/{id}/approve', [SupportTicketController::class, 'approve']);
Route::put('/support-tickets/{id}/reject', [SupportTicketController::class, 'reject']);

// Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Settings - Change Password
    Route::post('/settings/change-password', [SettingController::class, 'changePassword']);

    // Product & Inventory
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products/store',[ProductController::class,'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

   
    Route::get('/inventory/transactions', [InventoryController::class, 'getTransactions']);
    Route::post('/inventory/transactions', [InventoryController::class, 'logTransaction']);
    
    // QR Code Route
    Route::get('/products/search-by-qr/{id}', [ProductController::class, 'searchByQr']);
    
    // Purchase Orders
    Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
    Route::post('/purchase-orders/store', [PurchaseOrderController::class, 'store']);
    
    // Edit, Update සහ Delete සඳහා Routes
    Route::get('/purchase-orders/show/{id}', [PurchaseOrderController::class, 'show']); 
    Route::put('/purchase-orders/update/{id}', [PurchaseOrderController::class, 'update']); 
    Route::delete('/purchase-orders/delete/{id}', [PurchaseOrderController::class, 'destroy']); 
    
    //PO APPROVE & EMAIL SEND
    Route::post('/purchase-orders/approve/{id}', [PurchaseOrderController::class, 'approveAndSend']);
    
    // Suppliers
   // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::post('/suppliers', [SupplierController::class, 'store']); // <--- මේ රේඛාව අනිවාර්යයෙන් එකතු කරන්න!
    Route::put('/suppliers/{id}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

    // Users
    Route::get('/users', function() {
        return response()->json(\App\Models\User::all());
    });

    Route::post('/users/register', [UserController::class, 'store']); 
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // Reports
    Route::get('/reports/preview', [ReportController::class, 'previewData']);
    Route::get('/reports/export', [ReportController::class, 'exportReport']);
});

// Support Tickets
Route::post('/support-tickets', [SupportTicketController::class, 'store']);
Route::get('/support-tickets', [SupportTicketController::class, 'index']);

Route::get('/settings', [SettingController::class, 'getSettings']);
Route::post('/settings', [SettingController::class, 'updateSettings']);


// ⚡ SUPPLIER PUBLIC PORTAL ROUTES

Route::get('/public/po-tracking/{token}', [PurchaseOrderController::class, 'getPublicPO']);
Route::put('/public/po-tracking/{token}', [PurchaseOrderController::class, 'updatePublicStatus']);