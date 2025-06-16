import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';
import { NotFoundError } from '@/lib/errors/NotFoundError';

@injectable()
export class GetFolderSharesUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository,
    @inject('IShareFolderRepository')
    private sharedUserRepository: IShareFolderRepository
  ) {}

  async execute(params: { userId: string; folderId: string }): Promise<
    {
      userId: string;
      email: string;
      permission: 'READ' | 'WRITE';
    }[]
  > {
    const { userId, folderId } = params;

    const folder = await this.folderRepository.findById(folderId);
    if (!folder) throw new NotFoundError('폴더를 찾을 수 없습니다.');
    if (folder.ownerId !== userId) throw new ForbiddenError('접근 권한이 없습니다.');

    const sharedUsers = await this.sharedUserRepository.findUsersByFolderId(folderId);

    return sharedUsers.map(user => ({
      userId: user.userId,
      email: user.email,
      permission: user.permission,
    }));
  }
}
