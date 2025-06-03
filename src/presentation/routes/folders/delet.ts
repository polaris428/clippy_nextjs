import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase';
import { cookies } from 'next/headers';
import 'reflect-metadata';
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

  const folderId = params.id;

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  if (!folder || folder.ownerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.folder.delete({
    where: { id: folderId },
  });

  return NextResponse.json({
    success: true,
    folders: await prisma.folder.findMany({
      where: { ownerId: user.id },
    }),
  });
}
