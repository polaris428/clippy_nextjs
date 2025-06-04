import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';

@injectable()
export class GetAllFolderUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute(userId: string): Promise<{
    folders: Folder[];
    sharedFolders: Folder[];
  }> {
    const folders = await this.folderRepository.findFoldersByUserId(userId);
    const sharedFolders = await this.folderRepository.findShareFoldersByUserId(userId);
    return { folders, sharedFolders };
  }
}
