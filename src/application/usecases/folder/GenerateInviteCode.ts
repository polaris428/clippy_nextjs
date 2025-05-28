import { injectable, inject } from 'tsyringe';
import { randomUUID } from 'crypto';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class GenerateInviteCode {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute(folderId: string, isInvite: boolean, userId: string): Promise<string> {
    const folder = await this.folderRepository.findById(folderId);

    if (!folder || folder.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    const inviteCode = folder.inviteCode ?? randomUUID();

    await this.folderRepository.updateInviteCode({ folderId, isInvite, inviteCode });

    return inviteCode;
  }
}
