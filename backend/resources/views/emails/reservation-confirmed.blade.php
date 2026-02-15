<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservation Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0F0A08;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F0A08; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A110D; border-radius: 16px; overflow: hidden; border: 1px solid #8B5A2B;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #C98A5A 0%, #8B5A2B 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #0F0A08; font-size: 28px; font-weight: bold;">The Wooden Plate</h1>
                            <p style="margin: 8px 0 0 0; color: #1A110D; font-size: 14px;">Fine Dining Experience</p>
                        </td>
                    </tr>

                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #22c55e; font-size: 40px;">✓</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #22c55e; font-size: 24px; text-align: center; margin: 0 0 20px 0;">Reservation Confirmed!</h2>

                            <p style="color: #E7D2B6; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                Dear {{ $customerName }},
                            </p>

                            <p style="color: #BFA58A; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                                Great news! Your reservation at The Wooden Plate has been confirmed. We're looking forward to welcoming you.
                            </p>

                            <!-- Reservation Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F0A08; border-radius: 12px; border: 1px solid #8B5A2B; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: #C98A5A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Reservation Details</h3>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #BFA58A; font-size: 14px;">Table</td>
                                                <td style="padding: 8px 0; color: #E7D2B6; font-size: 14px; text-align: right; font-weight: 600;">{{ $tableName }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-bottom: 1px solid #8B5A2B40;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #BFA58A; font-size: 14px;">Date</td>
                                                <td style="padding: 8px 0; color: #E7D2B6; font-size: 14px; text-align: right; font-weight: 600;">{{ $date }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-bottom: 1px solid #8B5A2B40;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #BFA58A; font-size: 14px;">Time</td>
                                                <td style="padding: 8px 0; color: #E7D2B6; font-size: 14px; text-align: right; font-weight: 600;">{{ $time }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-bottom: 1px solid #8B5A2B40;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #BFA58A; font-size: 14px;">Duration</td>
                                                <td style="padding: 8px 0; color: #E7D2B6; font-size: 14px; text-align: right; font-weight: 600;">{{ $duration }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-bottom: 1px solid #8B5A2B40;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #BFA58A; font-size: 14px;">Party Size</td>
                                                <td style="padding: 8px 0; color: #E7D2B6; font-size: 14px; text-align: right; font-weight: 600;">{{ $partySize }} Guest(s)</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Important Notes -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(201, 138, 90, 0.1); border-radius: 12px; border: 1px solid rgba(201, 138, 90, 0.3);">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h4 style="color: #C98A5A; font-size: 14px; margin: 0 0 10px 0;">📋 Please Note</h4>
                                        <ul style="color: #BFA58A; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                            <li>Please arrive 10 minutes before your reservation time</li>
                                            <li>Your table will be held for 15 minutes</li>
                                            <li>For changes or cancellations, please contact us at least 2 hours in advance</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0F0A08; padding: 25px 30px; text-align: center; border-top: 1px solid #8B5A2B40;">
                            <p style="color: #BFA58A; font-size: 13px; margin: 0 0 10px 0;">
                                Questions? Contact us at <a href="mailto:info@thewoodenplate.com" style="color: #C98A5A; text-decoration: none;">info@thewoodenplate.com</a>
                            </p>
                            <p style="color: #BFA58A60; font-size: 12px; margin: 0;">
                                © {{ date('Y') }} The Wooden Plate. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
