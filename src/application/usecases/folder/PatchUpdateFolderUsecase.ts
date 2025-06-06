import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/folder/IFolderRepository';
import type { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
@injectable()
export class PatchUpdateFolderUsecase {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute({ folderId, data }: { folderId: string; data: FolderUpdateDto }) {
    return await this.folderRepository.updateFolder({ id: folderId, data: data });
  }
}
