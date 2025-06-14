import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';

@injectable()
export class GetAllFolderUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository,
    @inject('IShareFolderRepository')
    private shareFolderRepository: IShareFolderRepository
  ) {}

  async execute(userId: string): Promise<{
    folders: Folder[];
    sharedFolders: Folder[];
  }> {
    const folders = await this.folderRepository.getFoldersByUserId(userId);
    const sharedFolders = await this.shareFolderRepository.findShareFoldersByUserId(userId);
    return { folders, sharedFolders };
  }
}
