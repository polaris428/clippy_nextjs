import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';

import { IShareFolderRepository } from '../../domain/shere-folder/IShareFolderRepository';
import { Folder } from '@/types/folder/folder';

@injectable()
export class PrismaShareFolderRepository implements IShareFolderRepository {
  async findShareFoldersByUserId(userId: string): Promise<Folder[]> {
    const sharedFolders = await prisma.userFolderShare.findMany({
      where: {
        userId: userId, // 공유받은 유저 ID
      },
      include: {
        folder: {
          include: {
            links: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    return sharedFolders.map(shearFolder => ({
      id: shearFolder.id,
      name: shearFolder.folder.name,
      ownerId: shearFolder.folder.ownerId,
      isShared: shearFolder.folder.isShared,
      shareKey: shearFolder.folder.shareKey,
      createdAt: shearFolder.createdAt,
      links: shearFolder.folder.links,
      isInvite: shearFolder.folder.isInvite,
    }));
  }
  async delete(userId: string, folderId: string): Promise<void> {
    await prisma.userFolderShare.deleteMany({
      where: {
        folderId,
        userId,
      },
    });
  }
}
