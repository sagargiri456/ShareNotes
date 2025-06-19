import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

export async function POST(req: Request, { params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
      console.log("missing token");
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      console.log("invalid token");
    }
  
    const userId = decoded.userId;
if (!noteId || typeof noteId !== 'string') {
      return NextResponse.json({ error: 'Invalid noteId' }, { status: 400 });
    }
  const existing = await prisma.like.findFirst({ where: { noteId, userId } });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { noteId, userId } });
    return NextResponse.json({ liked: true });
  }
}

function verifyToken(token: string): DecodedToken | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as DecodedToken;
        return decoded;
    } catch (_error) {
        return null;
    }
}

