import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
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
    console.log('폴더 있음', folder);
    console.log('폴더 권한 있음', folder!.ownerId == userId);
    console.log('폴더 ID', folder!.ownerId);
    console.log('유저저 ID', userId);
    if (!folder || folder.ownerId != userId) {
      throw new NotFoundError('폴더를 찾을 수 없습니다.');
    }

    return { folder };
  }
}
