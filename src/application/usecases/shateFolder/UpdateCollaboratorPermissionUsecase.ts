import { injectable, inject } from 'tsyringe';
import type { FolderPermission } from '@prisma/client';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import { NotFoundError } from '@/lib/errors/NotFoundError';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';

interface Params {
  folderId: string;
  userId: string;
  permission: FolderPermission;
  currentUserId: string;
}

@injectable()
export class UpdateCollaboratorPermissionUsecase {
  constructor(
    @inject('IShareFolderRepository')
    private shareFolderRepository: IShareFolderRepository,
    @inject('IFolderRepository')
    private folderRepository: IFolderRepository
  ) {}

  async execute({ folderId, userId, permission, currentUserId }: Params): Promise<{ success: true }> {
    const folder = await this.folderRepository.findById(folderId);

    if (!folder) throw new NotFoundError('Folder not found');
    if (folder.ownerId !== currentUserId) throw new ForbiddenError();

    await this.shareFolderRepository.updateCollaboratorPermission(folderId, userId, permission);

    return { success: true };
  }
}
