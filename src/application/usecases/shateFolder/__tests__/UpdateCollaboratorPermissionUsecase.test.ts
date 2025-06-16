// src/application/usecases/folder/__tests__/UpdateCollaboratorPermissionUsecase.test.ts
import 'reflect-metadata';

import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import { NotFoundError } from '@/lib/errors/NotFoundError';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';
import type { Folder } from '@/types/folder/folder';
import type { FolderPermission } from '@prisma/client';
import { UpdateCollaboratorPermissionUsecase } from '../UpdateCollaboratorPermissionUsecase';

describe('UpdateCollaboratorPermissionUsecase', () => {
  /* ------------------------------------------------------------------ *
   * mock 레포지토리 준비
   * ------------------------------------------------------------------ */
  const folderRepo: jest.Mocked<IFolderRepository> = {
    createFolder: jest.fn(),
    getFoldersByUserId: jest.fn(),
    findById: jest.fn(),
    updateFolder: jest.fn(),
    findByInviteCode: jest.fn(),
    updateInviteCode: jest.fn(),
    addCollaborator: jest.fn(),
    deleteFolder: jest.fn(),
  };

  const shareRepo: jest.Mocked<IShareFolderRepository> = {
    findShareFoldersByUserId: jest.fn(),
    delete: jest.fn(),
    findByInviteCode: jest.fn(),
    updateInviteCode: jest.fn(),
    addCollaborator: jest.fn(),
    updateCollaboratorPermission: jest.fn(),
    findUsersByFolderId: jest.fn(),
  };

  const usecase = new UpdateCollaboratorPermissionUsecase(shareRepo, folderRepo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 폴더 소유자가 요청하면 협업자 권한을 업데이트하고 success를 반환한다', async () => {
    const folder: Folder = {
      id: 'f1',
      name: 'Design',
      ownerId: 'owner1',
      isShared: true,
      isInvite: true,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    folderRepo.findById.mockResolvedValue(folder);
    shareRepo.updateCollaboratorPermission.mockResolvedValue();

    const result = await usecase.execute({
      folderId: 'f1',
      userId: 'member1',
      permission: 'WRITE' as FolderPermission,
      currentUserId: 'owner1',
    });

    expect(shareRepo.updateCollaboratorPermission).toHaveBeenCalledWith('f1', 'member1', 'WRITE');
    expect(result).toEqual({ success: true });
  });

  it('📌 폴더를 찾지 못하면 NotFoundError를 던진다', async () => {
    folderRepo.findById.mockResolvedValue(null);

    await expect(
      usecase.execute({
        folderId: 'missing',
        userId: 'u2',
        permission: 'READ' as FolderPermission,
        currentUserId: 'ownerX',
      })
    ).rejects.toEqual(new NotFoundError('Folder not found'));

    expect(shareRepo.updateCollaboratorPermission).not.toHaveBeenCalled();
  });

  it('📌 현재 유저가 소유자가 아니면 ForbiddenError를 던진다', async () => {
    const folder: Folder = {
      id: 'f1',
      name: 'Team Folder',
      ownerId: 'realOwner',
      isShared: true,
      isInvite: true,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    folderRepo.findById.mockResolvedValue(folder);

    await expect(
      usecase.execute({
        folderId: 'f1',
        userId: 'member1',
        permission: 'READ' as FolderPermission,
        currentUserId: 'intruder',
      })
    ).rejects.toEqual(new ForbiddenError());

    expect(shareRepo.updateCollaboratorPermission).not.toHaveBeenCalled();
  });
});
