import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import { FolderUpdateInput } from '@/types/folder/FolderUpdateInput';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const folderId = params.id;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const decoded = await verifyIdToken(token);
  const uid = decoded.uid;

  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    return NextResponse.json({ error: '유저 없음' }, { status: 404 });
  }

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  if (!folder || folder.ownerId !== user.id) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 });
  }

  const body = await req.json();

  // 🔐 허용된 필드만 업데이트: 화이트리스트 방식
  const allowedFields = ['name', 'color', 'description', 'isShared'];
  const updateData: Partial<FolderUpdateInput> = {};

  for (const key of allowedFields) {
    if (key in body) {
      updateData[key as keyof FolderUpdateInput] = body[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '업데이트할 필드가 없습니다.' }, { status: 400 });
  }

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: updateData,
  });

  return NextResponse.json({ success: true, folder: updatedFolder });
}
