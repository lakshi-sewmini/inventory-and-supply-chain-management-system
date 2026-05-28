<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Showing all products and their categories and suppliers
    public function index()
    {
        return response()->json(Product::with(['category', 'suppliers'])->get(), 200);
    }

    // Adding a new item tothe system
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_code' => 'required|string|max:50|unique:products',
            'product_name' => 'required|string|max:150',
            'brand' => 'nullable|string|max:100',
            'unit_price' => 'required|numeric',
            'status' => 'required|string',
            'category_id' => 'required|string|exists:categories,category_id'
        ]);

        $product = Product::create($validated);
        return response()->json(['message' => 'The item was successfully added!', 'data' => $product], 201);
    }

    // SDS Business Rule: Getting a list of items (Alerts) below the reorder level
    public function lowStockAlerts()
    {
        // search for items  in the database that are less than the current quentity (quentity),reorder_level
        $lowStockProducts = Product::whereRaw('quantity <= reorder_level')->get();
        
        return response()->json([
            'alert_count' => $lowStockProducts->count(),
            'products' => $lowStockProducts
        ], 200);
    }
}

