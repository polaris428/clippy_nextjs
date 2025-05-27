import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';
import { getAuthCookie } from '@/lib/utils/cookies';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderCusecase';

export async function GET() {
  const token = await getAuthCookie();
  if (!token) {
    return NextResponse.json({ error: '인증 토큰 없음' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.error('❌ Firebase 토큰 검증 실패:', err);
    return NextResponse.json({ error: '토큰 검증 실패' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    return NextResponse.json({ error: '유저 없음' }, { status: 404 });
  }

  const folders = container.resolve(GetAllFolderUsecase);

  return NextResponse.json(folders, { status: 200 });
}
