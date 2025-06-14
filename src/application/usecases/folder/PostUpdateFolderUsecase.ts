import { injectable, inject } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import type { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
import { NotFoundError } from '@/lib/errors/NotFoundError';

@injectable()
export class PostUpdateFolderUsecase {
  constructor(
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute({ userId, folderId, data }: { userId: string; folderId: string; data: FolderUpdateDto }): Promise<Folder> {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder || folder.ownerId !== userId) {
      throw new NotFoundError('폴더를 찾을 수 없습니다.');
    }

    return await this.folderRepository.updateFolder({ id: folderId, data });
  }
}
