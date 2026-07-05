/**
 * Quick nodemailer smoke test.
 * Run: node scripts/test-email.js
 * Loads EMAIL_* vars from .env.local — fill those in before running.
 */

require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO, NEXT_PUBLIC_BASE_URL } = process.env

if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  console.error('❌  Missing EMAIL_USER, EMAIL_PASS, or EMAIL_TO in .env.local')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST ?? 'smtp.gmail.com',
  port: Number(EMAIL_PORT ?? 587),
  secure: Number(EMAIL_PORT) === 465,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
})

async function run() {
  console.log(`Sending test email to ${EMAIL_TO} via ${EMAIL_HOST}:${EMAIL_PORT} ...`)

  await transporter.sendMail({
    from: `"Joshua Fundraiser TEST" <${EMAIL_USER}>`,
    to: EMAIL_TO,
    subject: '✅ Nodemailer test — mamajoshua',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
        <h2 style="margin:0 0 12px;color:#0f172a;">✅ Nodemailer is working</h2>
        <p style="color:#475569;margin:0 0 8px;">Your email alerts are configured correctly for the <strong>Mrs Rose Joshua Memorial Fundraiser</strong>.</p>
        <p style="color:#94a3b8;font-size:13px;margin:0;">
          Sent from: ${EMAIL_USER}<br/>
          Base URL: ${NEXT_PUBLIC_BASE_URL ?? '(not set)'}<br/>
          Admin link: ${NEXT_PUBLIC_BASE_URL ? NEXT_PUBLIC_BASE_URL + '/admin' : '(set NEXT_PUBLIC_BASE_URL to see this)'}
        </p>
      </div>
    `,
  })

  console.log('✅  Email sent successfully — check your inbox.')
}

run().catch(err => {
  console.error('❌  Send failed:', err.message)
  process.exit(1)
})
