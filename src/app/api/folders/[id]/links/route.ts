import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import { scrapeMetadata } from '@/lib/scrapeMetadata';
import 'reflect-metadata';
interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: '인증 토큰 없음' }, { status: 401 });

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: '토큰 검증 실패' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) return NextResponse.json({ error: '유저 없음' }, { status: 404 });

  const folderId = params.id;
  const body = await req.json();
  const { url } = body;

  if (!folderId || !url) {
    return NextResponse.json({ error: 'folderId와 url은 필수입니다.' }, { status: 400 });
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  if (!folder || folder.ownerId !== user.id) {
    return NextResponse.json({ error: '폴더 접근 권한 없음' }, { status: 403 });
  }

  // 🔥 여기서 메타데이터 크롤링
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

  return NextResponse.json(newLink, { status: 201 });
}
