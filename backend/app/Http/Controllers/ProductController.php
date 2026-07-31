<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    // Showing all products and their categories and suppliers
    public function index()
    {
        return response()->json(Product::with(['category', 'suppliers'])->get(), 200);
    }

    // Adding a new item to the system
    public function store(Request $request)
    {
        // 1. මුලින්ම ආපු category_id එක database එකේ තියෙනවද බලනවා, නැත්නම් අලුතින් හදනවා
        Category::firstOrCreate(
            ['category_id' => $request->category_id], // මේ ID එක තියෙනවද බලන්න
            ['category_name' => $request->category_name] // නැත්නම් මේ නමින් අලුත් row එකක් create කරන්න
        );

        // 2. ඊටපස්සේ සාමාන්‍ය විදිහට Product එක සේဝ် කරනවා
        $product = new Product();
        $product->product_code = $request->product_code;
        $product->product_name = $request->product_name;
        $product->brand = $request->brand;
        $product->category_id = $request->category_id; // මෙතනට අර ID එක යනවා
        $product->unit_price = $request->unit_price;
        $product->quantity = $request->quantity;
        $product->reorder_level = $request->reorder_level;
        $product->status = $request->status;
        $product->save();

        return response()->json(['message' => 'Product and Category saved successfully!'], 201);
    }

    // SDS Business Rule: Getting a list of items (Alerts) below the reorder level
    public function lowStockAlerts()
    {
        // search for items in the database that are less than the current quantity (quantity), reorder_level
        $lowStockProducts = Product::whereRaw('quantity <= reorder_level')->get();
        
        return response()->json([
            'alert_count' => $lowStockProducts->count(),
            'products' => $lowStockProducts
        ], 200);
    }

    // QR Code එකෙන් Product එක search කරන නව function එක
    public function searchByQr($id)
    {
        // product_code එකෙන් DB එකේ search කිරීම
        $product = Product::where('product_code', $id)->first();

        // Product එක හමුවුවහොත් ඩේටා ටික React එකට යැවීම
        if ($product) {
            return response()->json([
                'success' => true,
                'message' => 'Product found successfully',
                'product' => [
                    'id' => $product->product_code, 
                    'name' => $product->product_name, // store function එකට අනුව product_name ලෙස නිවැරදි කරන ලදී
                    'stock_qty' => $product->quantity, 
                    'unit_price' => $product->unit_price
                ]
            ], 200);
        }

        // Product එක නැතිනම් 404 Error එකක් දීම
        return response()->json([
            'success' => false,
            'message' => 'Product not found in database!'
        ], 404);
    }
} 