import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class PostDeleteFolderUsecase {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute(userId: string, folderId: string) {
    await this.folderRepository.deleteFolder(folderId);
    return await this.folderRepository.getFoldersByUserId(userId);
  }
}
