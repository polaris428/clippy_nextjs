import { prisma } from '@/lib/prisma';
import { getVerifiedUserId } from '@/lib/utils/cookies';

export async function getCurrentUserId(): Promise<string> {
  const firebaseUid = await getVerifiedUserId();
  const user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user) throw new Error('User not found');
  return user.id;
}
