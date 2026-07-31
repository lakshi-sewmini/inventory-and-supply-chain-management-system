<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PurchaseOrderController extends Controller
{
    // සියලුම Purchase Orders ලබාගැනීමට
    public function index()
    {
        try {
            $orders = PurchaseOrder::orderBy('created_at', 'desc')->get();
            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch orders', 'error' => $e->getMessage()], 500);
        }
    }

    // 🔥 1. අලුතින් එකතු කළ SHOW Function එක (Edit Click එකට Items ටික ඇදලා ගන්න)
    public function show($id)
    {
        // id එකෙන් හෝ po_number එකෙන් order එක හොයාගෙන, ඒකෙ items ටිකත් එක්කම ගන්නවා
        $order = PurchaseOrder::with('items')
            ->where('id', $id)
            ->orWhere('po_number', $id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    // නව Purchase Order එකක් සෑදීමට
    public function store(Request $request)
    {
        $request->validate([
            'po_number' => 'required|string|unique:purchase_orders',
            'order_date' => 'required|date',
            'expected_date' => 'required|date',
            'tax' => 'required|numeric|min:0',
            'supplier_id' => 'required|string', 
            'items' => 'required|array|min:1',
            'items.*.product_code' => 'required|string', 
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $totalAmount = 0;

            // 1. Create main purchase order
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

            $purchaseOrder->update([
                'total_amount' => $totalAmount + $request->tax
            ]);

            DB::commit();
            return response()->json(['message' => 'Purchase order successfully submitted!', 'po_number' => $purchaseOrder->po_number], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order placement failed!', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($po_number)
    {
        try {
            // 1. මුලින්ම ඒ PO එකට අදාළ items ටික හොයාගන්න
            $order = PurchaseOrder::where('po_number', $po_number)->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            // 2. ඒ PO එකට අදාළ හැම item එකක්ම මකන්න (මේක තමයි වැදගත්ම පියවර)
            $order->items()->delete(); 

            // 3. දැන් PO එක මකන්න
            $order->delete();

            return response()->json(['message' => 'Purchase Order and its items deleted successfully'], 200);
            
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // 🔥 සකස් කළ APPROVE & SEND FUNCTION එක
    public function approveAndSend($po_number)
    {
        try {
            // Relationship එක්කම PO එක ඇදලා ගන්නවා
            $po = PurchaseOrder::with(['supplier', 'items'])->where('po_number', $po_number)->firstOrFail();

            // Supplier කෙනෙක් ඉන්නවද සහ එයාට email එකක් තියෙනවද කියලා check කරමු
            if (!$po->supplier || !$po->supplier->email) {
                return response()->json([
                    'message' => 'Failed to send email. Supplier email address not found in database!'
                ], 422);
            }

            // 1. Unique Token එකක් generate කරලා database සේව් කරනවා
            $token = Str::random(40);
            $po->update([
                'magic_token' => $token,
                'status' => 'Sent to Supplier'
            ]);

            // 2. React Public Tracking Route එකේ URL එක හදනවා
            $magicLink = "http://localhost:5173/public/po-tracking/" . $token;

            // 3. DomPDF මඟින් PDF එක memory එක ඇතුළේ හදනවා (resources/views/pdf/po.blade.php)
            $pdf = Pdf::loadView('pdf.po', compact('po'));

            // Supplier ගේ නම (DB එකේ තියෙන විදිහට supplier_name හෝ company_name ගන්න)
            $supplierName = $po->supplier->supplier_name ?? $po->supplier->company_name ?? 'Supplier';

            // 4. Supplier ගේ Email එකට PDF එක attach කරලා ඊමේල් එක auto යවනවා
            // compact() එකට magicLink දානකොට $ ලකුණ නැතිව දාන්න ඕනේ!
            Mail::send('emails.po_notification', compact('po', 'magicLink'), function($message) use ($po, $pdf) {
                $message->to($po->supplier->email)
                        ->subject('Purchase Order Approved: #' . $po->po_number)
                        ->attachData($pdf->output(), "PO-{$po->po_number}.pdf");
            });

            return response()->json([
                'message' => 'Purchase Order approved and sent to ' . $supplierName
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to approve and send PO',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // =======================================================
    // ⚠️ PUBLIC FUNCTIONS (මේවට Sanctum/Auth Middleware දාන්න එපා)
    // =======================================================

    // 2. Magic Token එකෙන් PO විස්තර Publicly ලබාගැනීම
    public function getPublicPO($token)
    {
        // Token එක වැරදිනම් කෙලින්ම 404 Error එකක් දෙනවා (Secure)
        $po = PurchaseOrder::with(['supplier', 'items.product'])
                            ->where('magic_token', $token)
                            ->first();

        if (!$po) {
            return response()->json(['message' => 'This link is invalid or has expired.'], 404);
        }

        return response()->json($po, 200);
    }

    // 3. Supplier විසින් Status එක Confirmed හෝ Shipped ලෙස වෙනස් කිරීම
    public function updatePublicStatus(Request $request, $token)
    {
        $request->validate([
            'status' => 'required|in:Confirmed,Shipped'
        ]);

        $po = PurchaseOrder::where('magic_token', $token)->first();

        if (!$po) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $po->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Purchase Order status updated to ' . $request->status . ' successfully!'
        ], 200);
    }
}