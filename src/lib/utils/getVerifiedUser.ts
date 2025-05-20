// lib/utils/getVerifiedUser.ts
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';

export async function getVerifiedUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  try {
    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true, name: true, email: true },
    });

    return user;
  } catch (err) {
    console.error('🔒 Token verification failed:', err);
    return null;
  }
}
