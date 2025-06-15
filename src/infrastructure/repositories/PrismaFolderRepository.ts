import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';
import { Folder } from '@/types/folder/folder';
import { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
import { FolderPermission } from '@prisma/client';
import { randomUUID } from 'crypto';
@injectable()
export class PrismaFolderRepository implements IFolderRepository {
  /**
   * 폴더 생성
   */
  async createFolder({ name, isShared, isInvite, isTemp, ownerId }: { name: string; isShared?: boolean; isInvite?: boolean; isTemp?: boolean; ownerId: string }): Promise<Folder> {
    const folder = await prisma.folder.create({
      data: {
        name,
        isShared: !!isShared,
        isInvite: !!isInvite,
        isTemp: isTemp,
        ownerId: ownerId,
        inviteCode: randomUUID(),
        shareKey: randomUUID(),
      },
      include: {
        links: true, // ✅ 링크 포함
      },
    });

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
   * 유저 ID 기준 폴더 전체 조회
   */
  async getFoldersByUserId(userId: string): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'asc' },
      include: {
        links: true, // ✅ 링크 포함
      },
    });

    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      shareKey: folder.shareKey,
      createdAt: folder.createdAt,
      links: folder.links,
      isInvite: folder.isInvite,
      inviteCode: folder.inviteCode,
      isTemp: folder.isTemp,
    }));
  }

  /**
   * 폴더 ID로 단일 폴더 조회
   */
  async findById(folderId: string): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        links: true,
      },
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

  async updateFolder({ id, data }: { id: string; data: FolderUpdateDto }): Promise<Folder> {
    const folder = await prisma.folder.update({
      where: { id },
      data,
      include: {
        links: true,
      },
    });

    return {
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      createdAt: folder.createdAt,
      links: folder.links,
      isInvite: folder.isInvite,
      inviteCode: folder.inviteCode,
      shareKey: folder.shareKey,
      isTemp: folder.isTemp,
    };
  }
  async findByInviteCode(inviteCode: string): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { inviteCode },
      include: {
        links: true,
      },
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
  async updateInviteCode(data: { folderId: string; isInvite: boolean; inviteCode: string }): Promise<void> {
    await prisma.folder.update({
      where: { id: data.folderId },
      data: {
        isInvite: data.isInvite,
        inviteCode: data.inviteCode,
      },
    });
  }

  async addCollaborator(data: { folderId: string; userId: string }): Promise<void> {
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
        permission: FolderPermission.WRITE,
      },
    });
  }

  async deleteFolder(folderId: string): Promise<void> {
    await prisma.folder.delete({ where: { id: folderId } });
  }
}
