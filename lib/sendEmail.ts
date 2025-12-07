import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
}

function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export async function sendEmail({ to, subject, text }: EmailOptions) {
  // Validate input parameters
  if (!to || !subject || !text) {
    throw new Error('All email fields (to, subject, text) are required.')
  }

  if (!validateEmail(to)) {
    throw new Error('Invalid email address provided.')
  }

  // Validate environment variables
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error('SMTP environment variables are not fully set.')
  }

  if (isNaN(Number(SMTP_PORT))) {
    throw new Error('SMTP_PORT must be a valid number.')
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  // Send email
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      text,
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email. Check SMTP configuration and network.')
  }
}
