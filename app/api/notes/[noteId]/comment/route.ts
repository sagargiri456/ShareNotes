import { prisma } from '@/lib/prisma';
import {cookies} from 'next/headers'
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}
// ✅ GET Comments (sorted by latest first)
export async function GET(req: Request, { params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  const comments = await prisma.comment.findMany({
    where: { noteId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } }, // agar user table link ho
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  const body = await req.json();
  const { content } = body;

  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userId = decoded.userId;
  if (!content) return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  
  const comment = await prisma.comment.create({
    data: {
      content,
      noteId,
      userId,
    },
  });

  return NextResponse.json(comment);
}
function verifyToken(token: string): DecodedToken | null {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as DecodedToken;
      return decoded;
  } catch (_error) {
      return null;
  }
}