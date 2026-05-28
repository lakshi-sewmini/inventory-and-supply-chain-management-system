<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'po_number' => 'required|string|unique:purchase_orders',
            'order_date' => 'required|date',
            'expected_date' => 'required|date',
            'tax' => 'required|numeric|min:0',
            'supplier_id' => 'required|string|exists:suppliers,supplier_id',
            'items' => 'required|array|min:1',
            'items.*.product_code' => 'required|string|exists:products,product_code',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $totalAmount = 0;

            // 1. Create main purchaseorder
            $purchaseOrder = PurchaseOrder::create([
                'po_number' => $request->po_number,
                'order_date' => $request->order_date,
                'expected_date' => $request->expected_date,
                'tax' => $request->tax,
                'total_amount' => 0, 
                'status' => 'Pending',
                'supplier_id' => $request->supplier_id,
                'user_id' => $request->user()->id,
            ]);

            // 2. Entering order items through a loop 
            foreach ($request->items as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                $totalAmount += $itemTotal;

                PurchaseOrderItem::create([
                    'po_number' => $purchaseOrder->po_number,
                    'product_code' => $item['product_code'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'Total' => $itemTotal,
                ]);
            }

            // Adding the total amount including tax and saving the final amount
            $purchaseOrder->update([
                'total_amount' => $totalAmount + $request->tax
            ]);

            DB::commit();
            return response()->json(['message' => 'purchase order successfully submitted!', 'po_number' => $purchaseOrder->po_number], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order placement failed!', 'error' => $e->getMessage()], 500);
        }
    }

}
