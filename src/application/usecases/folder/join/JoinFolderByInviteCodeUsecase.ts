import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';

@injectable()
export class JoinFolderByInviteCodeUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute(userId: string, inviteCode: string): Promise<void> {
    const folder = await this.folderRepository.findByInviteCode(inviteCode);

    if (!folder) throw new Error('초대 코드가 유효하지 않음');

    await this.folderRepository.addCollaborator({
      folderId: folder.id,
      userId,
    });
  }
}
