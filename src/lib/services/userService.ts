import prisma from '@/lib/prisma';

export async function getUserByFirebaseUid(firebaseUid: string) {
  return await prisma.user.findUnique({
    where: { firebaseUid },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function createUser(
  firebaseUid: string,
  email: string,
  name: string
) {
  return await prisma.user.create({
    data: {
      firebaseUid,
      email,
      name,
    },
  });
}

export async function getOrCreateUser(
  firebaseUid: string,
  email: string,
  name: string
) {
  let user = await getUserByFirebaseUid(firebaseUid);
  if (!user) {
    user = await createUser(firebaseUid, email, name);
  }
  return user;
}
