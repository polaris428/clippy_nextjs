import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = (await cookies()).get('token')?.value;
  const linkId = params.id;

  if (!token) {
    return NextResponse.json({ error: '인증되지 않음' }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ error: '유저 없음' }, { status: 403 });
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { folder: true },
    });

    if (!link || link.folder.ownerId !== user.id) {
      return NextResponse.json({ error: '해당 링크에 접근 권한 없음' }, { status: 403 });
    }

    const body = await req.json();
    const { isPin } = body;

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: { isPin: Boolean(isPin) },
    });

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (err) {
    console.error('🔥 좋아요 토글 실패:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
