import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';

export async function loginUser( token?: string) {
    
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

      
      const folderName = `${user.name}폴더`;

      await prisma.folder.create({
        data: {
          name: folderName,
          ownerId: user.id,
        },
      });

      console.log('📁 폴더 자동 생성 완료');
    } else {
      console.log('✅ 기존 유저 로그인:', user.id);
    }

    return { user };
  } catch (err) {
    console.error('🔥 loginUser 에러:', err);
    throw new Error('로그인 처리 중 문제가 발생했습니다.');
  }
}
