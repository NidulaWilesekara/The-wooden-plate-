<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>The Wooden Plate - OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px;background:#ffffff;border-radius:14px;
                      border:1px solid #e5e7eb;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
              <table width="100%">
                <tr>
                  <td style="display:flex;align-items:center;gap:10px;">
                    <img
                      src="{{ $logoUrl ?? 'https://dummyimage.com/40x40/8b5e3c/ffffff.png&text=WP' }}"
                      width="40"
                      height="40"
                      style="border-radius:8px"
                      alt="The Wooden Plate"
                    />
                    <div>
                      <div style="font-size:16px;font-weight:700;color:#1f2937;">
                        The Wooden Plate
                      </div>
                      <div style="font-size:12px;color:#6b7280;">
                        Taste of earth, served in style
                      </div>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size:12px;color:#8b5e3c;font-weight:600;">
                      OTP Verification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:26px 24px;">
              <h2 style="margin:0 0 8px 0;color:#111827;">
                Verify your email
              </h2>

              <p style="margin:0 0 18px 0;color:#4b5563;font-size:14px;line-height:1.6;">
                Hi {{ $name ?? 'there' }},<br>
                Use the one-time password (OTP) below to confirm your access to
                <strong>The Wooden Plate</strong>.
              </p>

              <!-- OTP Box -->
              <div style="margin:20px 0;padding:18px;border:1px dashed #d1d5db;
                          border-radius:12px;text-align:center;background:#fafafa;">
                <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">
                  YOUR OTP CODE
                </div>

                <div style="font-size:28px;font-weight:800;letter-spacing:6px;
                            color:#8b5e3c;">
                  {{ $otp }}
                </div>

                <div style="margin-top:8px;font-size:12px;color:#6b7280;">
                  This code is valid for {{ $expires ?? 5 }} minutes
                </div>
              </div>

              <!-- Button (optional) -->
              @if(!empty($verifyUrl))
                <div style="text-align:center;margin-top:22px;">
                  <a href="{{ $verifyUrl }}"
                     style="display:inline-block;padding:12px 22px;
                            background:#8b5e3c;color:#ffffff;
                            text-decoration:none;border-radius:999px;
                            font-size:14px;font-weight:600;">
                    Verify Now
                  </a>
                </div>
              @endif

              <p style="margin-top:24px;font-size:12px;color:#6b7280;line-height:1.6;">
                If you did not request this code, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;
                       background:#fafafa;font-size:12px;color:#6b7280;">
              <table width="100%">
                <tr>
                  <td>
                    © {{ date('Y') }} The Wooden Plate
                  </td>
                  <td align="right">
                    support@woodenplate.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
