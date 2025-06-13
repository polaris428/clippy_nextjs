import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';

import { IShareFolderRepository } from '../../domain/shere-folder/IShareFolderRepository';
import { Folder } from '@/types/folder/folder';
import { FolderPermission } from '@prisma/client';
import { SharedUser } from '@/types/shear/shared-user';

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
      id: shearFolder.folder.id,
      name: shearFolder.folder.name,
      ownerId: shearFolder.folder.ownerId,
      isShared: shearFolder.folder.isShared,
      shareKey: shearFolder.folder.shareKey,
      createdAt: shearFolder.createdAt,
      links: shearFolder.folder.links,
      isInvite: shearFolder.folder.isInvite,
      isTemp: shearFolder.folder.isTemp,
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
  /**
   * 1. 초대 코드로 폴더 찾기
   */
  async findByInviteCode(inviteCode: string) {
    const folder = await prisma.folder.findUnique({
      where: { inviteCode },
      include: { links: true },
    });

    if (!folder) return null;

    return {
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      createdAt: folder.createdAt,
      links: folder.links,
      isInvite: folder.isInvite,
      isTemp: folder.isTemp,
    };
  }

  /**
   * 2. 초대 코드 업데이트 (초대 활성화 or 비활성화)
   */
  async updateInviteCode(data: { folderId: string; isInvite: boolean; inviteCode: string }) {
    await prisma.folder.update({
      where: { id: data.folderId },
      data: {
        isInvite: data.isInvite,
        inviteCode: data.inviteCode,
      },
    });
  }

  /**
   * 3. 초대 수락 시 협업자 추가 (기본은 READ 권한)
   */
  async addCollaborator(data: { folderId: string; userId: string }) {
    await prisma.userFolderShare.upsert({
      where: {
        folderId_userId: {
          folderId: data.folderId,
          userId: data.userId,
        },
      },
      update: {},
      create: {
        folderId: data.folderId,
        userId: data.userId,
        permission: FolderPermission.READ, // ✅ 기본 권한은 READ
      },
    });
  }
  async updateCollaboratorPermission(folderId: string, userId: string, permission: FolderPermission): Promise<void> {
    await prisma.userFolderShare.update({
      where: {
        folderId_userId: {
          folderId,
          userId,
        },
      },
      data: {
        permission,
      },
    });
  }
  async findUsersByFolderId(folderId: string): Promise<SharedUser[]> {
    const shares = await prisma.userFolderShare.findMany({
      where: { folderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return shares.map(share => ({
      userId: share.user.id,
      email: share.user.email,
      permission: share.permission,
    }));
  }
}
