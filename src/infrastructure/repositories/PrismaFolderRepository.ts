import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';
import { Folder } from '@/types/folder/folder';
import { IFolderRepository } from '@/domain/folder/IFolderRepository';
import { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
@injectable()
export class PrismaFolderRepository implements IFolderRepository {
  /**
   * 폴더 생성
   */
  async createFolder(userId: string, name: string, isShared: boolean = false): Promise<Folder> {
    const folder = await prisma.folder.create({
      data: {
        name,
        ownerId: userId,
        isShared,
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
    console.log('폴더 조회', folders);
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
    }));
  }

  /**
   * 폴더 ID로 단일 폴더 조회
   */
  async findById(folderId: string): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        links: true, // ✅ 링크 포함
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
      inviteCode: folder.inviteCode,
    };
  }

  async updateFolder({ id, data }: { id: string; data: FolderUpdateDto }): Promise<Folder> {
    return prisma.folder.update({
      where: { id },
      data,
      include: {
        links: true,
      },
    });
  }
  async findByInviteCode(inviteCode: string): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { inviteCode },
      include: {
        links: true, // ✅ 링크 포함
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
        permission: 'write', // default to write, 또는 필요에 따라 확장 가능
      },
    });
  }

  async deleteFolder(folderId: string): Promise<void> {
    await prisma.folder.delete({ where: { id: folderId } });
  }
}
