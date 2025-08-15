import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ message: "Please provide a query." }, { status: 400 });
    }

    // A simple, tokenized search logic
    const searchTerms = query.toLowerCase().split(' ').filter((term: string) => term.length > 2);

    if (searchTerms.length === 0) {
      return NextResponse.json({ message: "Please enter a more specific query." });
    }

    // Use Prisma to find notes where the title or subject contains any of the search terms
    const notes = await prisma.note.findMany({
      where: {
        OR: searchTerms.map((term: string) => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { subject: { contains: term, mode: 'insensitive' } },
            // You can add more fields to search here
          ]
        }))
      },
      take: 5, // Limit the number of results
    });

    if (notes.length > 0) {
      return NextResponse.json({ 
        message: `I found the following notes based on your query:`,
        notes,
      });
    } else {
      return NextResponse.json({ 
        message: "I couldn't find any notes for that query. Try rephrasing or searching for a specific subject or title."
      });
    }

  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}