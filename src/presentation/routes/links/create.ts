import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { scrapeMetadata } from '@/lib/scrapeMetadata';
import 'reflect-metadata';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserOrThrow();
    const body = await req.json();
    const { folderId, url, title, description, image, favicon } = body;

    if (!folderId || !url) {
      return NextResponse.json({ success: false, error: 'folderId와 url은 필수입니다.' }, { status: 400 });
    }

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: '폴더 접근 권한 없음' }, { status: 403 });
    }

    let finalTitle = title?.trim();
    let finalDescription = description?.trim();
    let finalImage = image?.trim();
    let finalFavicon = favicon?.trim();

    // 누락된 필드만 크롤링해서 채움
    if (!finalTitle || !finalDescription || !finalImage || !finalFavicon) {
      try {
        const metadata = await scrapeMetadata(url);
        finalTitle ||= metadata.title;
        finalDescription ||= metadata.description;
        finalImage ||= metadata.image;
        finalFavicon ||= metadata.favicon;
      } catch (e) {
        console.warn('⚠️ 메타데이터 크롤링 실패 (무시하고 진행):', e);
      }
    }

    const newLink = await prisma.link.create({
      data: {
        folderId,
        url,
        title: finalTitle,
        description: finalDescription,
        thumbnail: finalImage,
        favicon: finalFavicon,
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
    if (err instanceof Response) return err;
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
