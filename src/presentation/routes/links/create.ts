import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { scrapeMetadata } from '@/lib/scrapeMetadata';
import 'reflect-metadata';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function POST(req: NextRequest) {
  console.log('sadfafsd');
  try {
    const user = await getCurrentUserOrThrow();

    const body = await req.json();
    const folderId = body.folderId;
    const { url } = body;

    if (!folderId || !url) {
      return NextResponse.json({ success: false, error: 'folderId와 url은 필수입니다.' }, { status: 400 });
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: '폴더 접근 권한 없음' }, { status: 403 });
    }

    try {
      const metadata = await scrapeMetadata(url);

      const newLink = await prisma.link.create({
        data: {
          folderId,
          url,
          title: metadata.title,
          description: metadata.description,
          thumbnail: metadata.image,
          favicon: metadata.favicon,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: '링크가 성공적으로 생성되었습니다.',
          link: newLink,
        },
        { status: 201 }
      );
    } catch (err) {
      console.error('🔥 링크 생성 실패:', err);
      return NextResponse.json({ success: false, error: '링크 생성 중 오류가 발생했습니다.' }, { status: 500 });
    }
  } catch (err) {
    if (err instanceof Response) {
      return err; // status 포함 응답 그대로 반환
    }
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
