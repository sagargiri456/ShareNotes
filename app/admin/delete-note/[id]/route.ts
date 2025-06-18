import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } //causing issue related to promise if were not using promise
) {
  const { id: noteId } = await params;

  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (_error) {
    return NextResponse.json(
      { error: 'Note not found or already deleted.' },
      { status: 404 }
    );
  }
}
