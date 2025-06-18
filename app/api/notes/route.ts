import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // const userId = await getUserIdFromToken(req); // ✅ or however you get userId
    const userId = "12121";
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    const { title, subject, semester, branch, year, fileUrl } = await req.json();
    console.log(title, subject, semester, branch, year, fileUrl);
    if (!title || !subject || !semester || !branch || !year || !fileUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    console.log("reached till prisma creation");
    const note = await prisma.Note.create({
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
