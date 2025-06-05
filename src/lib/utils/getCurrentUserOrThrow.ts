import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';

/**
 * 인증된 유저 정보를 반환합니다.
 * 인증 실패 시 401, 유저 없을 시 403 에러를 throw 합니다.
 */
export async function getCurrentUserOrThrow() {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    throw new Response('인증 토큰이 없습니다.', { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.warn('❌ 인증 토큰 검증 실패:', err);
    throw new Response('토큰 검증 실패', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    throw new Response('유저가 존재하지 않습니다.', { status: 403 });
  }

  return user;
}
