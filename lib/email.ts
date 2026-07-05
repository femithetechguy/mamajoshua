/**
 * lib/email.ts
 * Ref FTTG-104
 *
 * Nodemailer transporter + alert email for new donation submissions.
 * All config comes from env vars — no hardcoded values.
 *
 * Required env vars (.env.local + Vercel):
 *   EMAIL_HOST           — SMTP host, e.g. smtp.gmail.com
 *   EMAIL_PORT           — SMTP port, e.g. 587 (TLS) or 465 (SSL)
 *   EMAIL_USER           — SMTP username / sender address
 *   EMAIL_PASS           — SMTP password or Gmail App Password
 *   EMAIL_TO             — recipient address for alerts (organiser)
 *   NEXT_PUBLIC_BASE_URL — full site URL, e.g. https://mamajoshua.vercel.app
 *
 * Gmail setup: use an App Password, not your regular password.
 * https://support.google.com/accounts/answer/185833
 */

import nodemailer from 'nodemailer'
import { Donation } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT ?? 587),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/**
 * Send an alert email to the organiser when a donation is auto-approved.
 * Fires-and-forgets — a send failure must NOT block the API response.
 */
export async function sendDonationAlert(donation: Donation): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const adminUrl = `${baseUrl}/admin`
  const siteUrl = baseUrl

  const formattedAmount = `$${donation.amount.toLocaleString()}`
  const formattedDate = new Date(donation.submittedAt).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  })

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Donation — Mrs Rose Joshua Fundraiser</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:32px 36px;">
              <p style="margin:0 0 8px;color:#60a5fa;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                Fundraiser Alert
              </p>
              <h1 style="margin:0 0 4px;color:#f8fafc;font-size:24px;font-weight:800;line-height:1.2;">
                New donation received
              </h1>
              <p style="margin:0;color:#94a3b8;font-size:14px;">
                Mrs Rose Joshua Memorial Fundraiser
              </p>
            </td>
          </tr>

          <!-- Amount banner -->
          <tr>
            <td style="background:#2563eb;padding:20px 36px;">
              <p style="margin:0;color:#bfdbfe;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                Amount confirmed
              </p>
              <p style="margin:4px 0 0;color:#ffffff;font-size:40px;font-weight:900;line-height:1;">
                ${formattedAmount}
              </p>
            </td>
          </tr>

          <!-- Donor details -->
          <tr>
            <td style="background:#ffffff;padding:28px 36px;">

              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
                <tr>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#64748b;width:130px;vertical-align:top;">Full name</td>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#0f172a;">${donation.fullName}</td>
                </tr>
                <tr>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#64748b;vertical-align:top;">Shown on page as</td>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#334155;">${donation.displayName}</td>
                </tr>
                ${donation.contact ? `
                <tr>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#64748b;vertical-align:top;">Contact</td>
                  <td style="padding:11px 0;border-bottom:1px solid #f1f5f9;color:#334155;">${donation.contact}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:11px 0;color:#64748b;vertical-align:top;">Submitted</td>
                  <td style="padding:11px 0;color:#334155;">${formattedDate}</td>
                </tr>
              </table>

              <!-- Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 18px;font-size:13px;color:#713f12;line-height:1.5;">
                    This donation is <strong>live on the page right now.</strong>
                    If anything looks off — wrong amount, fake name — reject it from the admin dashboard before it misleads real donors.
                  </td>
                </tr>
              </table>

              <!-- CTA buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="${adminUrl}"
                       style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.3px;">
                      Open admin dashboard →
                    </a>
                  </td>
                </tr>
                ${siteUrl ? `
                <tr>
                  <td style="padding-top:12px;">
                    <a href="${siteUrl}"
                       style="display:inline-block;color:#2563eb;text-decoration:none;font-size:13px;font-weight:600;">
                      View fundraiser page ↗
                    </a>
                  </td>
                </tr>` : ''}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 36px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                You're receiving this because you're the organiser of the<br/>
                <strong style="color:#64748b;">Mrs Rose Joshua Memorial Fundraiser</strong>.<br/>
                This is an automated alert — do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `

  await transporter.sendMail({
    from: `"Joshua Fundraiser" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `💛 New donation: ${donation.displayName} — ${formattedAmount}`,
    html,
  })
}
