import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;
    const decoded = await verifyIdToken(token);
    return prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  } catch (err) {
    console.warn('❌ 인증 토큰 검증 실패:', err);
    return null;
  }
}
