import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { otp: true },
    });

    const storedOtp = user?.otp;

    if (!user || !storedOtp || storedOtp.code !== otp || new Date() > storedOtp.expiresAt) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // OTP is valid, proceed to the next step on the client side
    return NextResponse.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}