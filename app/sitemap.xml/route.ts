import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://sharenotes.store';

  const staticRoutes = [
    '',
    '/explore',
    '/upload',
    '/my-notes',
    '/signup',
    '/login',
    '/admin',
  ];

  const [notes, users] = await Promise.all([
    prisma.note.findMany({
      select: { id: true, createdAt: true, tags: true },
    }),
    prisma.user.findMany({
      select: { id: true, createdAt: true },
    }),
  ]);

  const noteRoutes = notes.map((note) => `
    <url>
      <loc>${baseUrl}/notes/${note.id}</loc>
      <lastmod>${note.createdAt.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `);

  const userRoutes = users.map((user) => `
    <url>
      <loc>${baseUrl}/user/${user.id}</loc>
      <lastmod>${user.createdAt.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
  `);

  const uniqueTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const tagRoutes = uniqueTags.map((tag) => `
    <url>
      <loc>${baseUrl}/tags/${encodeURIComponent(tag)}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>
  `);

  const staticXml = staticRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticXml}
    ${noteRoutes.join('')}
    ${userRoutes.join('')}
    ${tagRoutes.join('')}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
