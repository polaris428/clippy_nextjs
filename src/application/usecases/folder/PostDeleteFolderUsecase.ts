import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';
import type { Folder } from '@/types/folder/folder';

@injectable()
export class PostDeleteFolderUsecase {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository, @inject('IShareFolderRepository') private userFolderShareRepository: IShareFolderRepository) {}

  async execute(userId: string, folderId: string): Promise<{ deletedFolder: Folder; isShared: boolean }> {
    const userFolders = await this.folderRepository.getFoldersByUserId(userId);
    const isOwner = userFolders.some(folder => folder.id === folderId);

    if (isOwner) {
      const deletedFolder = userFolders.find(folder => folder.id === folderId);
      if (!deletedFolder) {
        throw new Error('삭제하려는 폴더를 찾을 수 없습니다.');
      }

      await this.folderRepository.deleteFolder(folderId);
      return {
        deletedFolder,
        isShared: false,
      };
    }

    const sharedFolders = await this.userFolderShareRepository.findShareFoldersByUserId(userId);
    const deletedFolder = sharedFolders.find(folder => folder.id === folderId);

    if (!deletedFolder) {
      throw new ForbiddenError('해당 폴더에 대한 삭제 권한이 없습니다.');
    }

    await this.userFolderShareRepository.delete(userId, folderId);
    return {
      deletedFolder,
      isShared: true,
    };
  }
}
