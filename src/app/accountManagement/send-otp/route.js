// File: src/app/api/send-otp/route.js
import nodemailer from 'nodemailer'

export async function POST(req) {
  const { email, code } = await req.json()

  // Configure Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calubcub1sthighschool@gmail.com',
      pass: 'zugd egjv pdzr fcex',    
    },
  })

  const mailOptions = {
    from: '"Calubcub High School" <your@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${code}`,
    html: `<p>Your OTP code is: <strong>${code}</strong></p>`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ success: false, error }), { status: 500 })
  }
}
