// /api/auth/me/route.ts
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = await verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Auth error', detail: `${err}` }, { status: 401 });
  }
}
