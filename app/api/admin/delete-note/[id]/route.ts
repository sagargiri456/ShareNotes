import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("Deleting Note with ID:", id);

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      console.warn("Note not found in DB.");
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("❌ Deletion failed with error:", error); // 🔍 See full error here
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
