<!DOCTYPE html>
<html>
<head>
    <title>Purchase Report</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; }
        h2 { text-align: center; margin-bottom: 5px; color: #2c3e50; }
        .date-range { text-align: center; margin-bottom: 20px; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; color: #2c3e50; }
        .footer { text-align: right; margin-top: 30px; font-size: 11px; color: #7f8c8d; }
    </style>
</head>
<body>
    <h2>Purchase Report</h2>
    <div class="date-range">Period: {{ $dateFrom ?? 'All' }} to {{ $dateTo ?? 'All' }}</div>

    <table>
        <thead>
            <tr>
                <th>Order No</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $order)
                <tr>
                    <td>{{ $order->order_no ?? $order->id }}</td>
                    <td>{{ $order->supplier->supplier_name ?? ($order->supplier->name ?? 'N/A') }}</td>
                    <td>{{ $order->order_date }}</td>
                    <td>{{ number_format($order->total_amount, 2) }}</td>
                    <td>{{ ucfirst($order->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="footer"><p>Smart Inventory & Supply Chain Management System</p></div>
</body>
</html>