<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Approved</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9; padding: 30px; margin: 0;">
    <div style="max-width: 550px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: #0b1329; padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Smart Inventory System</h2>
            <p style="color: #22c55e; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Access Granted</p>
        </div>
        <div style="padding: 35px 30px;">
            <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Welcome to the System!</h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear User,<br><br>
                Great news! Your account request has been <strong>Approved</strong> by the IT Administrator.
            </p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #166534; font-size: 14px;">Your Login Credentials:</h4>
                <table style="width: 100%; font-size: 13px;">
                    <tr>
                        <td style="color: #166534; font-weight: bold; padding-bottom: 8px; width: 140px;">Username (Email):</td>
                        <td style="color: #14532d; padding-bottom: 8px;">{{ $ticket->user_email }}</td>
                    </tr>
                    <tr>
                        <td style="color: #166534; font-weight: bold;">Temporary Password:</td>
                        <td style="color: #14532d; font-family: monospace; font-size: 14px; font-weight: bold; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">{{ $temporaryPassword }}</td>
                    </tr>
                </table>
            </div>
            <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
                * Security Tip: Please log in and change your password immediately from the Settings menu.
            </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            © 2026 Smart Inventory & Supply Chain System.
        </div>
    </div>
</body>
</html>