import { verifyIdToken } from '@/lib/firebase';
import { setAuthCookie } from './cookies';
import { NextRequest, NextResponse } from 'next/server';
import logger from '../logger/logger';

export async function tryParseAuthHeaderAndSetCookie(req: NextRequest): Promise<NextResponse | null> {
  const authHeader = req.headers.get('Authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!tokenFromHeader) return null;

  try {
    await verifyIdToken(tokenFromHeader);
    const res = NextResponse.next();
    setAuthCookie(res, tokenFromHeader);
    return res;
  } catch (err) {
    logger.warn({ err }, 'Authorization 헤더 토큰 검증 실패:');

    return null;
  }
}
