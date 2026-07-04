/**
 * lib/email.ts
 * Ref FTTG-104
 *
 * Nodemailer transporter + alert email for new donation submissions.
 * All config comes from env vars — no hardcoded values.
 *
 * Required env vars (.env.local + Vercel):
 *   EMAIL_HOST        — SMTP host, e.g. smtp.gmail.com
 *   EMAIL_PORT        — SMTP port, e.g. 587 (TLS) or 465 (SSL)
 *   EMAIL_USER        — SMTP username / sender address
 *   EMAIL_PASS        — SMTP password or Gmail App Password
 *   EMAIL_TO          — recipient address for alerts (organiser)
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

  const formattedAmount = `$${donation.amount.toLocaleString()}`
  const formattedDate = new Date(donation.submittedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
      <div style="background: #0f172a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <p style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px;">Fundraiser Alert</p>
        <h1 style="color: #f1f5f9; font-size: 22px; margin: 0;">New donation confirmed</h1>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 130px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${donation.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Displayed as</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${donation.displayName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Amount</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 18px; color: #2563eb;">${formattedAmount}</td>
          </tr>
          ${donation.contact ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Contact</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${donation.contact}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; color: #64748b;">Submitted</td>
            <td style="padding: 10px 0;">${formattedDate}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #713f12;">
          This donation is <strong>live on the page</strong>. If it looks suspicious, reject it in the admin panel before it misleads real donors.
        </div>

        ${adminUrl ? `
        <a href="${adminUrl}" style="display: inline-block; margin-top: 20px; background: #1e293b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Open admin panel →
        </a>` : ''}

      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Fundraiser Alerts" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New donation: ${donation.displayName} — ${formattedAmount}`,
    html,
  })
}
