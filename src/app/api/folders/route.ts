import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const { name, isShared } = await req.json();

    // 유저 확인
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const folder = await prisma.folder.create({
      data: {
        name,
        isShared: !!isShared,
        ownerId: user.id,
      },
    });

    return NextResponse.json(folder);
  } catch (err) {
    console.error('🔥 폴더 생성 오류:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
