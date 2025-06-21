import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromToken(req.headers); // ✅ or however you get userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    const { title, subject, semester, branch, year, fileUrl } = await req.json();
    if (!title || !subject || !semester || !branch || !year || !fileUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const note = await prisma.note.create({
      data: {
        title,
        subject,
        semester,
        branch,
        year,
        fileUrl,
        authorId: userId,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
