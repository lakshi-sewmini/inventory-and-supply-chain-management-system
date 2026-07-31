<!DOCTYPE html>
<html>
<head>
    <title>Stock Report</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; }
        h2 { text-align: center; margin-bottom: 5px; color: #2c3e50; }
        .date-range { text-align: center; margin-bottom: 20px; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; color: #2c3e50; }
        .text-right { text-align: right; }
        .footer { text-align: right; margin-top: 30px; font-size: 11px; color: #7f8c8d; }
    </style>
</head>
<body>
    <h2>Stock Report & Valuation</h2>
    <div class="date-range">Period: {{ $dateFrom ?? 'All' }} to {{ $dateTo ?? 'All' }}</div>

    <table>
        <thead>
            <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th class="text-right">Opening</th>
                <th class="text-right">Stock In (+)</th>
                <th class="text-right">Stock Out (-)</th>
                <th class="text-right">Closing</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $row)
                <tr>
                    <td>{{ $row['code'] }}</td>
                    <td>{{ $row['name'] }}</td>
                    <td class="text-right">{{ $row['opening'] }}</td>
                    <td class="text-right" style="color: green;">{{ $row['stockIn'] }}</td>
                    <td class="text-right" style="color: red;">{{ $row['stockOut'] }}</td>
                    <td class="text-right" style="font-weight: bold;">{{ $row['closing'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="footer"><p>Smart Inventory & Supply Chain Management System</p></div>
</body>
</html>