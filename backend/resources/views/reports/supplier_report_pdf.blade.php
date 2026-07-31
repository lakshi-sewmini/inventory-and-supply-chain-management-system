<!DOCTYPE html>
<html>
<head>
    <title>Supplier Report</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; }
        h2 { text-align: center; margin-bottom: 20px; color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; color: #2c3e50; }
        .footer { text-align: right; margin-top: 30px; font-size: 11px; color: #7f8c8d; }
    </style>
</head>
<body>
    <h2>Supplier Report</h2>
    <p>Generated Date: {{ date('Y-m-d H:i:s') }}</p>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $supplier)
                <tr>
                    <td>{{ $supplier->id }}</td>
                    <td>{{ $supplier->supplier_name ?? $supplier->name }}</td>
                    <td>{{ $supplier->email }}</td>
                    <td>{{ $supplier->phone ?? $supplier->contact_number }}</td>
                    <td>{{ $supplier->company_name ?? 'N/A' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <div class="footer"><p>Smart Inventory & Supply Chain Management System</p></div>
</body>
</html>