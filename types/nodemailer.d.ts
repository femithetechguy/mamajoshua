/**
 * Minimal type shim for nodemailer.
 * Replace with `npm install --save-dev @types/nodemailer` for full types.
 * Ref FTTG-104
 */
declare module 'nodemailer' {
  interface TransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: { user?: string; pass?: string }
    [key: string]: unknown
  }

  interface MailOptions {
    from?: string
    to?: string | string[]
    subject?: string
    html?: string
    text?: string
    [key: string]: unknown
  }

  interface Transporter {
    sendMail(options: MailOptions): Promise<unknown>
  }

  function createTransport(options: TransportOptions): Transporter
  export = { createTransport }
}
