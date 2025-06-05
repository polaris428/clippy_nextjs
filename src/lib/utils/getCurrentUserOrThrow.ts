import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
/**
 * 인증된 유저 정보를 반환합니다.
 * 인증 실패 시 401, 유저 없을 시 403 에러를 throw 합니다.
 */
export async function getCurrentUserOrThrow(req?: NextRequest): Promise<{ id: string }> {
  let token: string | undefined;

  // 1. Authorization 헤더에서 Bearer 토큰 추출 (선택적 인자)
  if (req) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  // 2. 쿠키에서 토큰 추출 (Fallback)
  if (!token) {
    token = (await cookies()).get('token')?.value;
  }

  // 3. 토큰 없으면 401
  if (!token) {
    throw new Response(JSON.stringify({ error: '인증 토큰이 없습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.log(token);
  // 4. Firebase 토큰 검증
  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.error('❌ 인증 토큰 검증 실패:', err);
    throw new Response(
      JSON.stringify({
        error: 'Firebase ID token has expired. Get a fresh ID token from your client app and try again',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 5. DB에서 사용자 조회
  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    throw new Response(JSON.stringify({ error: '유저가 존재하지 않습니다.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return user;
}
