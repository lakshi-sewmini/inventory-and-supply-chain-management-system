<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Request Rejected</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9; padding: 30px; margin: 0;">
    <div style="max-width: 550px; background-color: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: #0b1329; padding: 25px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Smart Inventory System</h2>
            <p style="color: #38bdf8; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">IT Administration</p>
        </div>
        <div style="padding: 35px 30px;">
            <h3 style="color: #1e293b; margin-top: 0; font-size: 18px;">Update Regarding Your Support Request</h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Dear User,<br><br>
                Thank you for contacting the Smart Inventory Helpdesk. We have reviewed your recent request, and unfortunately, it has been <strong>Rejected</strong> by the system administrator.
            </p>
            <div style="background-color: #fff1f2; border: 1px solid #ffe4e6; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <table style="width: 100%; font-size: 13px;">
                    <tr>
                        <td style="color: #9f1239; font-weight: bold; padding-bottom: 8px; width: 110px;">Request Type:</td>
                        <td style="color: #4c0519; padding-bottom: 8px;">{{ $ticket->request_type }}</td>
                    </tr>
                    <tr>
                        <td style="color: #9f1239; font-weight: bold; vertical-align: top;">Admin Note:</td>
                        <td style="color: #4c0519; line-height: 1.4;">Your profile details could not be verified. Please contact the HR department to correct your credentials.</td>
                    </tr>
                </table>
            </div>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            © 2026 Smart Inventory & Supply Chain System.
        </div>
    </div>
</body>
</html>