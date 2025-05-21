import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';
import { randomUUID } from 'crypto';

interface Input {
  folderId: string;
  userId: string;
  isShared: boolean;
}

@injectable()
export class UpdateFolderShare {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute({ folderId, userId, isShared }: Input): Promise<{ shareKey: string | null }> {
    console.log('safsdfafs');
    const folder = await this.folderRepository.findById(folderId);
    console.log('safsdfssdsds1212afs');
    if (!folder || folder.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    const shareKey = isShared ? folder.shareKey ?? randomUUID() : null;

    await this.folderRepository.updateShare(folderId, {
      isShared,
      shareKey,
    });

    return { shareKey };
  }
}
