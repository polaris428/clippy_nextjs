import { inject, injectable } from 'tsyringe';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';

@injectable()
export class PostCreateFolderUsecase {
  constructor(@inject('IFolderRepository') private folderRepository: IFolderRepository) {}

  async execute({ name, isShared, isInvite, isTemp, ownerId }: { name: string; isShared?: boolean; isInvite?: boolean; isTemp?: boolean; ownerId: string }) {
    return await this.folderRepository.createFolder({ name, isShared, isInvite, isTemp, ownerId });
  }
}
