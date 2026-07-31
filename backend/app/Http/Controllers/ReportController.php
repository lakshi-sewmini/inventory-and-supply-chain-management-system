<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\StockTransaction;
use App\Exports\StockReportExport;
use App\Exports\SupplierReportExport;
use App\Exports\PurchaseReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function exportReport(Request $request)
    {
        try {
            $type = $this->normalizeReportType($request->query('report_type'));
            $format = strtolower($request->query('format', 'excel'));
            $dateFrom = $request->query('date_from');
            $dateTo = $request->query('date_to');

            // 📊 1. Handle Excel Export
            if ($format === 'excel') {
                $fileName = strtolower(str_replace(' ', '_', $type)) . '.xlsx';
                if ($type === 'Supplier Report') {
                    return Excel::download(new SupplierReportExport(), $fileName);
                }
                if ($type === 'Purchase Report') {
                    return Excel::download(new PurchaseReportExport($dateFrom, $dateTo), $fileName);
                }
                return Excel::download(new StockReportExport($dateFrom, $dateTo), $fileName);
            }

            // 📄 2. Handle PDF Export
            $reportData = [];
            $view = '';

            if ($type === 'Supplier Report') {
                $reportData = Supplier::all();
                $view = 'reports.supplier_report_pdf';
            } elseif ($type === 'Purchase Report') {
                $query = PurchaseOrder::with('supplier');
                if ($dateFrom) $query->whereDate('order_date', '>=', $dateFrom);
                if ($dateTo) $query->whereDate('order_date', '<=', $dateTo);
                $reportData = $query->get();
                $view = 'reports.purchase_report_pdf';
            } else {
                $products = Product::all();
                foreach ($products as $product) {
                    $query = StockTransaction::where('product_code', $product->product_code);
                    if ($dateFrom) $query->whereDate('date', '>=', $dateFrom);
                    if ($dateTo) $query->whereDate('date', '<=', $dateTo);
                    
                    $transactions = $query->get();
                    $stockIn = $transactions->whereIn('status', ['stock in', 'in', 'Stock In'])->sum('quantity');
                    $stockOut = $transactions->whereIn('status', ['stock out', 'out', 'Stock Out'])->sum('quantity');

                    $reportData[] = [
                        'code' => $product->product_code,
                        'name' => $product->product_name,
                        'opening' => (int)$product->quantity - $stockIn + $stockOut,
                        'stockIn' => $stockIn,
                        'stockOut' => $stockOut,
                        'closing' => (int)$product->quantity
                    ];
                }
                $view = 'reports.stock_report_pdf';
            }

            // Blade view ෆයිල් එක තියෙනවද කියලා check කරනවා crash නොවී බේරෙන්න
            if (!view()->exists($view)) {
                return response()->json([
                    'error' => "Blade view file [{$view}] not found inside resources/views/ directory."
                ], 500);
            }

            $pdf = Pdf::loadView($view, compact('reportData', 'dateFrom', 'dateTo'));
            $fileName = strtolower(str_replace(' ', '_', $type)) . '.pdf';
            
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->header('Cache-Control', 'no-cache, private')
                ->header('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type');

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server caught an internal error during exportation.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function previewData(Request $request)
    {
        $type = $this->normalizeReportType($request->query('report_type'));
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        if ($type === 'Supplier Report') return response()->json(Supplier::all());

        if ($type === 'Purchase Report') {
            $query = PurchaseOrder::with('supplier');
            if ($dateFrom) $query->whereDate('order_date', '>=', $dateFrom);
            if ($dateTo) $query->whereDate('order_date', '<=', $dateTo);
            
            return response()->json($query->get());
        }

        $products = Product::all();
        $reportData = [];
        foreach ($products as $product) {
            $query = StockTransaction::where('product_code', $product->product_code);
            if ($dateFrom) $query->whereDate('date', '>=', $dateFrom);
            if ($dateTo) $query->whereDate('date', '<=', $dateTo);

            $transactions = $query->get();
            $stockIn = $transactions->whereIn('status', ['stock in', 'in', 'Stock In'])->sum('quantity');
            $stockOut = $transactions->whereIn('status', ['stock out', 'out', 'Stock Out'])->sum('quantity');

            $reportData[] = [
                'code'     => $product->product_code,
                'name'     => $product->product_name,
                'opening'  => (int)$product->quantity - $stockIn + $stockOut,
                'stockIn'  => $stockIn,
                'stockOut' => $stockOut,
                'closing'  => (int)$product->quantity
            ];
        }
        return response()->json($reportData);
    }

    private function normalizeReportType($frontendType)
    {
        $frontendType = trim($frontendType);
        if ($frontendType === 'Purchases History' || $frontendType === 'Purchase Report') return 'Purchase Report';
        if ($frontendType === 'Suppliers Directory' || $frontendType === 'Supplier Report') return 'Supplier Report';
        return 'Stock Report';
    }
}