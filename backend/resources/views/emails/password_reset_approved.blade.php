<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Approved</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9; padding: 30px; margin: 0;">
    <div style="max-width: 550px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: #0b1329; padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Smart Inventory System</h2>
            <p style="color: #3b82f6; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Password Reset</p>
        </div>
        <div style="padding: 35px 30px;">
            <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Your Password Has Been Reset!</h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear User,<br><br>
                Your request to reset your password has been **Approved** by the IT Administrator. Your password has been securely updated.
            </p>
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1e40af; font-size: 14px;">Your New Login Credentials:</h4>
                <table style="width: 100%; font-size: 13px;">
                    <tr>
                        <td style="color: #1e40af; font-weight: bold; padding-bottom: 8px; width: 140px;">Username (Email):</td>
                        <td style="color: #1e3a8a; padding-bottom: 8px;">{{ $ticket->user_email }}</td>
                    </tr>
                    <tr>
                        <td style="color: #1e40af; font-weight: bold;">New Temporary Password:</td>
                        <td style="color: #1e3a8a; font-family: monospace; font-size: 14px; font-weight: bold; background: #dbeafe; padding: 2px 6px; border-radius: 4px;">{{ $temporaryPassword }}</td>
                    </tr>
                </table>
            </div>
            <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
                * Security Tip: Please log in using this temporary password and change it immediately from your profile settings.
            </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            © 2026 Smart Inventory & Supply Chain System.
        </div>
    </div>
</body>
</html>