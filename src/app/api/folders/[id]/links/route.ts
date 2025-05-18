import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';

interface Params {
  params: {
    id: string; // 폴더 ID (URL 파라미터로부터 받음)
  };
}

export async function POST(req: NextRequest, { params }: Params) {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증 토큰 없음' }, { status: 401 });
  }

  let uid: string;
  try {
    
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
    console.log('✅ 인증된 UID:', uid);
  } catch (err) {
    console.error('🔥 토큰 검증 실패:', err);
    return NextResponse.json({ error: '토큰 검증 실패' }, { status: 403 });
  }
 const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });
  let body;
  try {
    body = await req.json(); // ✅ 바디 파싱은 반드시 한 번만
  } catch (err) {
    console.error('❌ 요청 바디 파싱 실패:', err);
    return NextResponse.json({ error: '요청 바디 파싱 실패' }, { status: 400 });
  }

  const { title, url } = body;
  const folderId = params.id;
  console.log("folderId ",folderId)
  if (!folderId || !title || !url) {
    return NextResponse.json({ error: 'folderId, title, url 모두 필요합니다.' }, { status: 400 });
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });
   console.log("folderId ",folder)
   
   console.log("uid ", uid)
   console.log("folder ",folder?.ownerId)
  if (!folder || folder.ownerId !== user?.id) {
    return NextResponse.json({ error: '폴더 접근 권한 없음' }, { status: 403 });
  }

  const newLink = await prisma.link.create({
    data: {
      folderId,
      title,
      url,
    },
  });

  return NextResponse.json(newLink, { status: 201 });
}



export async function GET(_: NextRequest, { params }: Params) {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증 토큰 없음' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: '토큰 검증 실패' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    return NextResponse.json({ error: '유저를 찾을 수 없음' }, { status: 404 });
  }

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
  });

  if (!folder || folder.ownerId !== user.id) {
    return NextResponse.json({ error: '폴더 접근 권한 없음' }, { status: 403 });
  }

  const links = await prisma.link.findMany({
    where: { folderId: params.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ links });
}