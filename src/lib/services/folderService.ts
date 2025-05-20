import prisma from '@/lib/prisma';

export async function getFoldersByUserId(userId: string) {
  return await prisma.folder.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      links: {
        select: {
          id: true,
          title: true,
          url: true,
          description: true,
          thumbnail: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function createDefaultFolder(userId: string, userName: string) {
  return await prisma.folder.create({
    data: {
      name: `${userName}폴더`,
      ownerId: userId,
    },
  });
}

export async function getUserFoldersOrCreateDefault(
  userId: string,
  userName: string
) {
  const folders = await getFoldersByUserId(userId);
  if (folders.length > 0) return folders;

  const newFolder = await createDefaultFolder(userId, userName);
  return [newFolder];
}
