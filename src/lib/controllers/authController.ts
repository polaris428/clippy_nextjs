import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';

export async function loginUser(token?: string) {
  if (!token) throw new Error('No auth token provided');

  try {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;
    const name = decoded.name || decoded.displayName || 'Unnamed';
    const email = decoded.email || '';

    console.log('✅ Firebase 토큰 디코딩:', { uid: firebaseUid, name, email });

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

      console.log('✅ 신규 유저 등록 완료:', user.id);

      const folder = await prisma.folder.create({
        data: {
          name: `${user.name}폴더`,
          ownerId: user.id,
        },
      });

      console.log('📁 폴더 자동 생성 완료:', folder.id);
    } else {
      console.log('✅ 기존 유저 로그인:', user.id);
    }

    // ✅ 모든 폴더 가져오기 (리팩터링 포인트)
    const folders = await prisma.folder.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    console.log('📂 전체 폴더 개수:', folders.length);

    return {
      user,
      folders,
    };
  } catch (err) {
    console.error('🔥 loginUser 에러:', err);
    throw new Error('로그인 처리 중 문제가 발생했습니다.');
  }
}
