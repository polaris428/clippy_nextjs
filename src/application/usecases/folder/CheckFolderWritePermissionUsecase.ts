// src/application/usecases/folder/CheckFolderWritePermissionUsecase.ts
import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { HttpError } from '@/lib/errors/HttpError';
import { FolderPermission } from '@prisma/client';

@injectable()
export class CheckFolderWritePermissionUsecase {
  constructor(@inject('IFolderRepository') private folderRepo: IFolderRepository, @inject('IShareFolderRepository') private shareRepo: IShareFolderRepository) {}

  async execute(params: { folderId: string; userId: string }) {
    const { folderId, userId } = params;

    const folder = await this.folderRepo.findById(folderId);
    if (!folder) throw new HttpError(404, '폴더를 찾을 수 없습니다.');

    if (folder.ownerId === userId) return;
    const users = await this.shareRepo.findUsersByFolderId(folderId);
    const canWrite = users.some(u => u.userId === userId && u.permission === FolderPermission.WRITE);

    if (!canWrite) throw new HttpError(403, '폴더에 대한 쓰기 권한이 없습니다.');
  }
}
