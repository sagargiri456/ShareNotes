import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://sharenotes.store';

  // Add more routes manually or generate from DB if dynamic
  const routes = [
    '', // homepage
    '/explore',
    '/upload',
    '/about',
    '/contact',
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        (route) => `
      <url>
        <loc>${baseUrl}${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
