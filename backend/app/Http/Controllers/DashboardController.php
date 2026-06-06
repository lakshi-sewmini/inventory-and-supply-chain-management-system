<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Models\PurchaseOrder;
use App\Models\Supplier; // Supplier Model එක තිබේ නම්
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 1. ප්‍රධාන ගණනය කිරීම් (Counts)
            $totalProducts = Product::count();
            
            // Supplier Model එකක් ඇත්නම් Count කරයි, නැත්නම් 0 වේ
            $totalSuppliers = class_exists('App\Models\Supplier') ? Supplier::count() : 0; 
            
            // ඔබේ ProductController එකේ ඇති ආකාරයටම low stock ගණනය කිරීම
            $lowStockAlerts = Product::whereRaw('quantity <= reorder_level')->count();
            
            $totalPurchases = PurchaseOrder::count();
            $pendingOrders = PurchaseOrder::where('status', 'Pending')->count();
            
            // 2. අද දින සිදු වූ ගනුදෙනු ප්‍රමාණය (Stock Transactions)
            $todayTransactions = StockTransaction::whereDate('date', Carbon::today())->count();
            
            // 3. මෑත කාලීන ගනුදෙනු ලැයිස්තුව (Recent Transactions) 5ක් ලබා ගැනීම
            $recentTransactions = StockTransaction::orderBy('date', 'desc')
                                                    ->take(5)
                                                    ->get();

            // React Frontend එක බලාපොරොත්තු වන JSON ව්‍යුහය
            return response()->json([
                'totalProducts' => $totalProducts,
                'totalSuppliers' => $totalSuppliers,
                'lowStockAlerts' => $lowStockAlerts,
                'totalPurchases' => $totalPurchases,
                'pendingOrders' => $pendingOrders,
                'todayTransactions' => $todayTransactions,
                'transactions' => $recentTransactions
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Dashboard data tracking failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}