import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const noteId = params.id;

  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (_error) {
    return NextResponse.json({ error: 'Note not found or already deleted.' }, { status: 404 });
  }
}
