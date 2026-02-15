<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservation Cancelled</title>
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

                    <!-- Cancel Icon -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: rgba(239, 68, 68, 0.2); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #ef4444; font-size: 40px;">✕</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h2 style="color: #ef4444; font-size: 24px; text-align: center; margin: 0 0 20px 0;">Reservation Cancelled</h2>

                            <p style="color: #E7D2B6; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                                Dear {{ $customerName }},
                            </p>

                            <p style="color: #BFA58A; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                                We regret to inform you that your reservation at The Wooden Plate has been cancelled.
                            </p>

                            <!-- Reservation Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F0A08; border-radius: 12px; border: 1px solid #8B5A2B; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: #C98A5A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Cancelled Reservation</h3>

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
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @if($reason)
                            <!-- Reason Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3); margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h4 style="color: #ef4444; font-size: 14px; margin: 0 0 10px 0;">Reason</h4>
                                        <p style="color: #BFA58A; font-size: 14px; line-height: 1.6; margin: 0;">{{ $reason }}</p>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Rebook CTA -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(201, 138, 90, 0.1); border-radius: 12px; border: 1px solid rgba(201, 138, 90, 0.3);">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="color: #BFA58A; font-size: 14px; margin: 0 0 15px 0;">We'd love to have you dine with us another time!</p>
                                        <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/reservation"
                                           style="display: inline-block; background: linear-gradient(135deg, #C98A5A 0%, #D7B38A 100%); color: #0F0A08; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 14px;">
                                            Book Another Reservation
                                        </a>
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
