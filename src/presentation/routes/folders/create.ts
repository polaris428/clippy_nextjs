import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';
import { cookies } from 'next/headers';
import 'reflect-metadata';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    const uid = decoded.uid;

    const { name, isShared } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      return NextResponse.json({ error: '유저 없음' }, { status: 404 });
    }

    const newFolder = await prisma.folder.create({
      data: {
        name,
        isShared: !!isShared,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ newFolder });
  } catch (err) {
    console.error('🔥 폴더 생성 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
