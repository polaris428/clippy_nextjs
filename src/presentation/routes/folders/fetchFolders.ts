import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';
import { cookies } from 'next/headers';
import 'reflect-metadata';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(token);
    const folders = await prisma.folder.findMany({
      where: { owner: { firebaseUid: decoded.uid } },
      select: {
        id: true,
        name: true,
        links: {},
      },
    });
    console.log('유저 폴더 리스트', JSON.stringify(folders, null, 2));
    return NextResponse.json({ folders });
  } catch (err) {
    console.error('❌ 폴더 목록 로드 실패:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
