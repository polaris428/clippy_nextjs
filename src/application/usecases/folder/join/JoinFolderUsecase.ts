import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';

@injectable()
export class JoinFolderUsecase {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute({ inviteCode, userId }: { inviteCode: string; userId: string }): Promise<{ folderId: string }> {
    const folder = await this.folderRepository.findByInviteCode(inviteCode);

    if (!folder) {
      throw new Error('Invalid invite code');
    }

    await this.folderRepository.addCollaborator({
      folderId: folder.id,
      userId,
    });

    return { folderId: folder.id };
  }
}
