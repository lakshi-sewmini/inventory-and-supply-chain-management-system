<!DOCTYPE html>
<html>
<head>
    <title>Purchase Order Approved</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #334155; line-height: 1.6; background-color: #f8fafc; padding: 20px; }
        .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background-color: #2563eb; padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .content { padding: 24px; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; margin-top: 15px; margin-bottom: 15px; text-align: center; }
        .btn:hover { background-color: #1d4ed8; }
        .details-box { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { font-size: 12px; color: #64748b; text-align: center; padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>

<div class="card">
    <div class="header">
        <h1>New Purchase Order Placed</h1>
    </div>
    
    <div class="content">
        <p>Dear <strong>{{ $po->supplier->supplier_name ?? $po->supplier->company_name ?? 'Supplier' }}</strong>,</p>
        
        <p>We are pleased to place a new Purchase Order with you. Please find the order summary below:</p>
        
        <div class="details-box">
            <table width="100%" cellpadding="5">
                <tr><td><strong>PO Number:</strong></td><td>#{{ $po->po_number }}</td></tr>
                <tr><td><strong>Order Date:</strong></td><td>{{ $po->order_date }}</td></tr>
                <tr><td><strong>Expected Date:</strong></td><td>{{ $po->expected_date }}</td></tr>
                <tr><td><strong>Total Amount:</strong></td><td>Rs. {{ number_format($po->total_amount, 2) }}</td></tr>
            </table>
        </div>

        <p>The official purchase order document has been generated and attached to this email as a PDF.</p>
        
        <p><strong>Please click the link below to view this order details online, confirm your receipt, and update the shipping status:</strong></p>
        
        <div style="text-align: center;">
            <a href="{{ $magicLink }}" class="btn">View & Confirm Order Online</a>
        </div>
        
        <p>If you have any questions, please reply directly to this email.</p>
    </div>

    <div class="footer">
        <p>This is an automated notification. Please do not reply directly to this footer.</p>
    </div>
</div>

</body>
</html>