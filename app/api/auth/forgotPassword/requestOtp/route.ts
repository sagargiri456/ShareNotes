import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';

// Setup Nodemailer transporter (replace with your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp' with host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save or update the OTP in the database
    await prisma.otp.upsert({
      where: { userId: user.id },
      update: { code: otp, expiresAt },
      create: { userId: user.id, code: otp, expiresAt },
    });

    // Send the OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    });

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}