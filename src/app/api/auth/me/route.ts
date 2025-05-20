import { NextResponse } from 'next/server';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1️⃣ 토큰 검증 및 유저 조회
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ 유저의 폴더 목록 + 링크 포함 조회
    const folders = await prisma.folder.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        links: {
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            thumbnail: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ user, folders });
  } catch (err) {
    console.error('🔥 /api/me error:', err);
    return NextResponse.json(
      { error: 'Server error', detail: `${err}` },
      { status: 500 }
    );
  }
}
