<?php

namespace App\Exports;

use App\Models\Supplier;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SupplierReportExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Supplier::all();
    }

    public function headings(): array
    {
        return ['Supplier ID', 'Supplier Name', 'Contact Person', 'Phone Number', 'Email Address', 'Address', 'Status'];
    }

    public function map($supplier): array
    {
        return [
            $supplier->supplier_id,
            $supplier->supplier_name,
            $supplier->contact_person ?? 'N/A',
            $supplier->phone ?? 'N/A',
            $supplier->email ?? 'N/A',
            $supplier->address ?? 'N/A',
            $supplier->status ?? 'Active'
        ];
    }
}