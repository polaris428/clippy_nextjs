import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';
import logger from '../logger/logger';

export async function loginUser(token?: string) {
  if (!token) throw new Error('No auth token provided');

  try {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;
    const name = decoded.name || decoded.displayName || 'Unnamed';
    const email = decoded.email || '';

    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name,
        },
      });

      await prisma.folder.create({
        data: {
          name: `${user.name}폴더`,
          ownerId: user.id,
        },
      });
    } else {
    }

    // ✅ 모든 폴더 가져오기 (리팩터링 포인트)
    const folders = await prisma.folder.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    return {
      user,
      folders,
    };
  } catch (err) {
    logger.error({ err }, '🔥 loginUser 에러:');
    throw new Error('로그인 처리 중 문제가 발생했습니다.');
  }
}
