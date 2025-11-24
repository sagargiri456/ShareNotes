import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserIdFromToken(_headers: Headers): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    //as { userId: string }
    // TypeScript ka part hai. Ye batata hai ki verify karne ke baad decoded object mein userId naam ka
    //  ek field hoga jo ek string type ka hai.
    return decoded.userId;
  } catch (_err) {
    return null;
  }
}
export function isAdmin(email: string | null | undefined): boolean {
    return email === process.env.ADMIN_EMAIL;
}
export async function getCurrentUser() {
  
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  
  const user = await prisma.user.findFirst({ where: { id: decoded.userId } });
  if (user) {
    // Log only non-sensitive info
    console.log({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
  }
  return user;
}
  
