<!DOCTYPE html>
<html>
<head>
    <title>Purchase Order</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333333; line-height: 1.6; }
        .container { padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; }
        .header { background-color: #2563eb; color: white; padding: 15px; border-radius: 6px 6px 0 0; }
        .content { padding: 20px 0; }
        .footer { font-size: 12px; color: #64748b; margin-top: 20px; border-t: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Purchase Order Approved</h2>
        </div>
        <div class="content">
            <p>Dear <strong>{{ $purchaseOrder->supplier->supplier_name ?? 'Supplier' }}</strong>,</p>
            
            <p>We are pleased to place the following Purchase Order with you. Please find the details below:</p>
            
            <ul>
                <li><strong>PO Number:</strong> {{ $purchaseOrder->po_number }}</li>
                <li><strong>Order Date:</strong> {{ $purchaseOrder->order_date }}</li>
                <li><strong>Expected Date:</strong> {{ $purchaseOrder->expected_date }}</li>
                <li><strong>Total Amount:</strong> Rs. {{ number_format($purchaseOrder->total_amount, 2) }}</li>
            </ul>

            <p>We have attached the official Purchase Order PDF to this email for your reference.</p>
            <p>Please confirm receipt of this order and let us know the delivery schedule.</p>
        </div>
        <div class="footer">
            <p>This is an automated email from our Inventory Management System.</p>
        </div>
    </div>
</body>
</html>