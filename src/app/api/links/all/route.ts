import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: '인증 안됨' }, { status: 401 });

  const decoded = await verifyIdToken(token);
  const firebaseUid = decoded.uid;

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) return NextResponse.json({ error: '유저 없음' }, { status: 404 });

  const links = await prisma.link.findMany({
    where: { folder: { ownerId: user.id } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ links });
}
