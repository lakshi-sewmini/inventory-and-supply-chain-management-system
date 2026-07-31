<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    // 1. Database එකේ දැනට තියෙන Transactions ලැයිස්තුව ලබා ගැනීම
    public function getTransactions()
    {
        try {
            // Frontend එකට ලේසි වෙන්න කෙලින්ම Array එකක් විදිහට දත්ත යවමු
            $transactions = StockTransaction::orderBy('created_at', 'desc')->get();
            return response()->json($transactions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch data', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 2. නව Transactions ලැයිස්තුවක් එකවර සේව් කිරීම (Bulk Insert)
    public function logTransaction(Request $request)
    {
        // Validation එක සරල කළා (Unique අයින් කළා, මොකද item කිහිපයක් එකම TRN එකෙන් එන්න පුළුවන් නිසා)
        $request->validate([
            'transaction_id' => 'required|string',
            'status'         => 'required|string|in:Stock In,Stock Out',
            'items'          => 'required|array|min:1',
            'items.*.product_code' => 'required|string',
            'items.*.batch_no'     => 'required|string',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.unit_cost'    => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $savedTransactions = [];

            foreach ($request->items as $item) {
                // Product එක හොයනවා
                $product = Product::where('product_code', $item['product_code'])->first();

                // Product එක ඩේටාබේස් එකේ නැත්නම් ක්‍රියාවලිය නවත්වනවා (500 Error වෙනුවට පැහැදිලි Message එකක් දෙනවා)
                if (!$product) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Product code '{$item['product_code']}' does not exist in the system. Please register it first!"
                    ], 400);
                }

                // Stock Out එකකදී බඩු මදිදැයි පරීක්ෂා කිරීම
                if ($request->status === 'Stock Out' && $product->quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "There is not enough stock for product code: {$item['product_code']}! Available stock: {$product->quantity}"
                    ], 400);
                }

                // Recording the transaction
                $transaction = StockTransaction::create([
                    'transaction_id' => $request->transaction_id . '-' . $item['product_code'],
                    'batch_no'       => $item['batch_no'],
                    'quantity'       => $item['quantity'],
                    'unit_cost'      => $item['unit_cost'],
                    'total_cost'     => $item['quantity'] * $item['unit_cost'],
                    'date'           => now()->toDateString(),
                    'status'         => $request->status,
                    'supplier'       => $request->supplier ?? null, 
                    'user_id'        => $request->user() ? $request->user()->id : 1, // User Token එක නැතත් Error නොවී බේරෙන්න
                    'product_code'   => $item['product_code'],
                ]);

                // Automatic updating of stock quantities
                if ($request->status === 'Stock In') {
                    $product->increment('quantity', $item['quantity']);
                    $product->update(['status' => 'Available']);
                } else {
                    $product->decrement('quantity', $item['quantity']);
                    if ($product->quantity <= 0) {
                        $product->update(['status' => 'Out of Stock']);
                    }
                }

                $savedTransactions[] = $transaction;
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'The inventory report was successfully updated!', 
                'transactions' => $savedTransactions
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Log Transaction Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Process failed!', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}