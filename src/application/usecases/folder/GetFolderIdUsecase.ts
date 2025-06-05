import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import { NotFoundError } from '@/lib/errors/NotFoundError';

@injectable()
export class GetFolderIdUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute({ userId, folderId }: { userId: string; folderId: string }): Promise<{ folder: Folder }> {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder || folder.ownerId !== userId) {
      throw new NotFoundError('폴더를 찾을 수 없습니다.');
    }

    return { folder };
  }
}
