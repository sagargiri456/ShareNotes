import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  console.log("GET method is accessible");
  const user = await getCurrentUser();
  console.log(user);
  return NextResponse.json({ user });
}
