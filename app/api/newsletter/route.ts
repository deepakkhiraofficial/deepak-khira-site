import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  console.log('Newsletter subscription:', email)
  // Here you can integrate with Mailchimp / SendGrid
  return NextResponse.json({ success: true })
}


