import { injectable } from 'tsyringe';
import { prisma } from '@/lib/prisma';
import { Folder } from '@/domain/folder/Folder';
import { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class PrismaFolderRepository implements IFolderRepository {
  /**
   * 폴더 생성
   */
  async createFolder(
    userId: string,
    name: string,
    isShared: boolean = false
  ): Promise<Folder> {
    const folder = await prisma.folder.create({
      data: {
        name,
        ownerId: userId,
        isShared,
      },
    });

    return {
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      createdAt: folder.createdAt,
    };
  }

  /**
   * 유저 ID 기준 폴더 전체 조회
   */
  async findFoldersByUserId(userId: string): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'asc' },
    });

    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      createdAt: folder.createdAt,
    }));
  }

  /**
   * 폴더 ID로 단일 폴더 조회
   */
  async findById(folderId: string): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) return null;

    return {
      id: folder.id,
      name: folder.name,
      ownerId: folder.ownerId,
      isShared: folder.isShared,
      createdAt: folder.createdAt,
    };
  }
}
