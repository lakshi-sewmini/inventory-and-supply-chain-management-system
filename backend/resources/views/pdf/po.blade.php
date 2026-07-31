<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Order - {{ $po->po_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.4; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .logo-section { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title-section { text-align: right; font-size: 18px; font-weight: bold; color: #475569; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .info-box { width: 48%; vertical-align: top; }
        .info-title { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 8px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .items-table th { background-color: #f1f5f9; color: #475569; font-weight: bold; padding: 10px; border: 1px solid #cbd5e1; text-align: left; }
        .items-table td { padding: 10px; border: 1px solid #cbd5e1; }
        .totals-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .totals-box { width: 40%; margin-left: 60%; }
        .totals-row td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
        .grand-total { font-weight: bold; font-size: 15px; color: #2563eb; }
    </style>
</head>
<body>

    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td class="logo-section">
                Smart Inventory System
            </td>
            <td class="title-section">
                PURCHASE ORDER
            </td>
        </tr>
    </table>

    <!-- Supplier & PO General Details -->
    <table class="info-table">
        <tr>
            <!-- Company Info -->
            <td class="info-box" style="padding-right: 20px;">
                <div class="info-title">Supplier Details</div>
                <strong>{{ $po->supplier->supplier_name ?? $po->supplier->company_name ?? 'N/A' }}</strong><br>
                Email: {{ $po->supplier->email ?? 'N/A' }}<br>
                Phone: {{ $po->supplier->contact_no ?? 'N/A' }}<br>
            </td>
            
            <!-- PO Info -->
            <td class="info-box">
                <div class="info-title">Order Information</div>
                <strong>PO Number:</strong> #{{ $po->po_number }}<br>
                <strong>Order Date:</strong> {{ $po->order_date }}<br>
                <strong>Expected Date:</strong> {{ $po->expected_date }}<br>
                <strong>Status:</strong> {{ $po->status }}<br>
            </td>
        </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 10%;">#</th>
                <th style="width: 50%;">Product Code / Name</th>
                <th style="width: 12%; text-align: center;">Qty</th>
                <th style="width: 13%; text-align: right;">Unit Price (Rs.)</th>
                <th style="width: 15%; text-align: right;">Total (Rs.)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($po->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item->product_code }}</strong>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->unit_price, 2) }}</td>
                    <td style="text-align: right;">{{ number_format($item->Total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals Section -->
    <table class="totals-table">
        <tr>
            <td style="width: 50%; vertical-align: top;">
                <p style="font-size: 11px; color: #64748b;">Terms: Delivery of items should be made on or before the expected date.</p>
            </td>
            <td style="width: 50%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr class="totals-row">
                        <td style="text-align: left;">Tax:</td>
                        <td style="text-align: right;">Rs. {{ number_format($po->tax, 2) }}</td>
                    </tr>
                    <tr class="totals-row">
                        <td style="text-align: left;" class="grand-total">Total Amount:</td>
                        <td style="text-align: right;" class="grand-total">Rs. {{ number_format($po->total_amount, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
</html>