import 'reflect-metadata';
import { CheckFolderWritePermissionUsecase } from '@/application/usecases/folder/CheckFolderWritePermissionUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { HttpError } from '@/lib/errors/HttpError';
import type { Folder } from '@/types/folder/folder';
import type { SharedUser } from '@/types/share/shared-user';

describe('CheckFolderWritePermissionUsecase', () => {
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

  const usecase = new CheckFolderWritePermissionUsecase(folderRepo, shareRepo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 폴더가 없으면 404 예외를 던진다', async () => {
    folderRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute({ folderId: 'invalid', userId: 'user1' })).rejects.toEqual(new HttpError(404, '폴더를 찾을 수 없습니다.'));

    expect(shareRepo.findUsersByFolderId).not.toHaveBeenCalled();
  });

  it('📌 소유자는 바로 통과해야 한다', async () => {
    const folder: Folder = {
      id: 'f1',
      name: 'My Folder',
      ownerId: 'owner1',
      isShared: true,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    folderRepo.findById.mockResolvedValue(folder);

    await expect(usecase.execute({ folderId: 'f1', userId: 'owner1' })).resolves.toBeUndefined();

    expect(shareRepo.findUsersByFolderId).not.toHaveBeenCalled();
  });

  it('📌 공유자 중 쓰기 권한이 있으면 통과해야 한다', async () => {
    const folder: Folder = {
      id: 'f1',
      name: 'Shared Folder',
      ownerId: 'owner1',
      isShared: true,
      isInvite: true,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    const sharedUsers: SharedUser[] = [
      {
        userId: 'user2',
        email: 'user2@example.com',
        permission: 'WRITE',
      },
    ];

    folderRepo.findById.mockResolvedValue(folder);
    shareRepo.findUsersByFolderId.mockResolvedValue(sharedUsers);

    await expect(usecase.execute({ folderId: 'f1', userId: 'user2' })).resolves.toBeUndefined();

    expect(shareRepo.findUsersByFolderId).toHaveBeenCalledWith('f1');
  });

  it('📌 쓰기 권한이 없으면 403 예외를 던진다', async () => {
    const folder: Folder = {
      id: 'f1',
      name: 'Shared Folder',
      ownerId: 'owner1',
      isShared: true,
      isInvite: true,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    const sharedUsers: SharedUser[] = [
      {
        userId: 'user2',
        email: 'user2@example.com',
        permission: 'READ',
      },
    ];

    folderRepo.findById.mockResolvedValue(folder);
    shareRepo.findUsersByFolderId.mockResolvedValue(sharedUsers);

    await expect(usecase.execute({ folderId: 'f1', userId: 'user2' })).rejects.toEqual(new HttpError(403, '폴더에 대한 쓰기 권한이 없습니다.'));
  });
});
