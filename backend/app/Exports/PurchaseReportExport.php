<?php

namespace App\Exports;

use App\Models\PurchaseOrder;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PurchaseReportExport implements FromCollection, WithHeadings, WithMapping
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
        $query = PurchaseOrder::with('supplier');

        if ($this->dateFrom) $query->whereDate('order_date', '>=', $this->dateFrom);
        if ($this->dateTo) $query->whereDate('order_date', '<=', $this->dateTo);

        return $query->get();
    }

    public function headings(): array
    {
        return ['PO Number', 'Order Date', 'Expected Date', 'Supplier Name', 'Total Amount', 'Tax', 'Status'];
    }

    public function map($purchase): array
    {
        return [
            $purchase->po_number,
            $purchase->order_date,
            $purchase->expected_date ?? 'N/A',
            $purchase->supplier ? $purchase->supplier->supplier_name : 'N/A',
            'Rs. ' . number_format($purchase->total_amount, 2),
            'Rs. ' . number_format($purchase->tax, 2),
            $purchase->status ?? 'Pending'
        ];
    }
}