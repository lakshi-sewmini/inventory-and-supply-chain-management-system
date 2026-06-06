<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function logTransaction(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|string|unique:stock_transactions',
            'batch_no' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric',
            'status' => 'required|string|in:Stock In,Stock Out',
            'product_code' => 'required|string|exists:products,product_code'
        ]);

        DB::beginTransaction();
        try {
            $product = Product::where('product_code',$request->product_code)->first();

            // During a stock out,do not allow more than the quentity in the warehouse to be released
            if ($request->status === 'Stock Out' && $product->quantity < $request->quantity) {
                return response()->json(['message' => 'There is not enough stock in the warehouse!'], 400);
            }

            // recording the transaction
            $transaction = StockTransaction::create([
                'transaction_id' => $request->transaction_id,
                'batch_no' => $request->batch_no,
                'quantity' => $request->quantity,
                'unit_cost' => $request->unit_cost,
                'total_cost' => $request->quantity * $request->unit_cost,
                'date' => now(),
                'status' => $request->status,
                'user_id' => $request->user()->id, 
                'product_code' => $request->product_code,
            ]);

            // automatic updating of stock quantities
            if ($request->status === 'Stock In') {
                $product->increment('quantity', $request->quantity);
                $product->update(['status' => 'Available']);
            } else {
                $product->decrement('quantity', $request->quantity);
                if ($product->quantity <= 0) {
                    $product->update(['status' => 'Out of Stock']);
                }
            }

            DB::commit();
            return response()->json(['message' => 'The inventory report was successfuly updated!', 'transaction' => $transaction], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'process failed!', 'error' => $e->getMessage()], 500);
        }
    }
}
