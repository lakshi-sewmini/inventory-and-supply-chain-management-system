<?php

namespace App\Exports;

use App\Models\Product;
use App\Models\StockTransaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StockReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $dateFrom;
    protected $dateTo;

    public function __construct($dateFrom, $dateTo)
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
    }

    public function collection()
    {
        return Product::all();
    }

    public function headings(): array
    {
        return ['Product Code', 'Product Name', 'Opening Stock', 'Stock In', 'Stock Out', 'Closing Stock'];
    }

    public function map($product): array
    {
        $productCode = $product->product_code;

        $currentQuery = StockTransaction::where('product_code', $productCode);
        if ($this->dateFrom) $currentQuery->whereDate('date', '>=', $this->dateFrom);
        if ($this->dateTo) $currentQuery->whereDate('date', '<=', $this->dateTo);

        $currentTransactions = $currentQuery->get();
        $stockIn = 0;
        $stockOut = 0;

        foreach ($currentTransactions as $t) {
            $status = strtolower(trim($t->status));
            if ($status === 'stock in' || $status === 'in') {
                $stockIn += (int)$t->quantity;
            } elseif ($status === 'stock out' || $status === 'out') {
                $stockOut += (int)$t->quantity;
            }
        }

        $totalInAfterFilter = StockTransaction::where('product_code', $productCode)
            ->whereIn('status', ['stock in', 'in', 'Stock In'])
            ->when($this->dateFrom, function($q) { $q->whereDate('date', '>=', $this->dateFrom); })->sum('quantity');
          
        $totalOutAfterFilter = StockTransaction::where('product_code', $productCode)
            ->whereIn('status', ['stock out', 'out', 'Stock Out'])
            ->when($this->dateFrom, function($q) { $q->whereDate('date', '>=', $this->dateFrom); })->sum('quantity');

        $currentQty = (int)$product->quantity;
        $openingStock = $currentQty - $totalInAfterFilter + $totalOutAfterFilter;
        $closingStock = $openingStock + $stockIn - $stockOut;

        return [
            $productCode,
            $product->name,
            $openingStock,
            '+' . $stockIn,
            '-' . $stockOut,
            $closingStock
        ];
    }
}