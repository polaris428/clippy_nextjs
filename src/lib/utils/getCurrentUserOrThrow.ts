import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

import { ForbiddenError } from '../errors/ForbiddenError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import logger from '../logger/logger';
/**
 * 인증된 유저 정보를 반환합니다.
 * 인증 실패 시 UnauthorizedError (401),
 * 유저 없을 시 ForbiddenError (403)를 throw 합니다.
 */
export async function getCurrentUserOrThrow(req?: NextRequest): Promise<{ id: string }> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    token = (await cookies()).get('token')?.value;
  }

  if (!token) {
    throw new UnauthorizedError('인증 토큰이 없습니다.');
  }

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    logger.error('❌ 인증 토큰 검증 실패:', err);
    throw new UnauthorizedError('Firebase ID token has expired. Get a fresh ID token from your client app and try again');
  }
  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    throw new ForbiddenError('유저가 존재하지 않습니다.');
  }

  return user;
}
