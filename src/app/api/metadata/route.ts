import logger from '@/lib/logger/logger';
import { scrapeMetadata } from '@/lib/scrapeMetadata';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
    }

    const metadata = await scrapeMetadata(url);

    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('❌ API 오류:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
