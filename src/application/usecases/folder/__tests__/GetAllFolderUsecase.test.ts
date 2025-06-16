// src/application/usecases/folder/__tests__/GetAllFolderUsecase.test.ts
import 'reflect-metadata';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import type { Folder } from '@/types/folder/folder';

describe('GetAllFolderUsecase', () => {
  /* ------------------------------------------------------------------ *
   * 1) 두 레포지토리를 mock 으로 준비                                    *
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

  const usecase = new GetAllFolderUsecase(folderRepo, shareRepo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 개인 폴더와 공유 폴더를 모두 반환한다', async () => {
    const myFolders: Folder[] = [
      {
        id: 'f1',
        name: 'My',
        ownerId: 'user1',
        isShared: false,
        isInvite: false,
        isTemp: false,
        createdAt: new Date(),
        links: [],
      },
    ];

    const sharedFolders: Folder[] = [
      {
        id: 'sf1',
        name: 'Team',
        ownerId: 'owner1',
        isShared: true,
        isInvite: true,
        isTemp: false,
        createdAt: new Date(),
        links: [],
      },
    ];

    folderRepo.getFoldersByUserId.mockResolvedValue(myFolders);
    shareRepo.findShareFoldersByUserId.mockResolvedValue(sharedFolders);

    const result = await usecase.execute('user1');

    expect(folderRepo.getFoldersByUserId).toHaveBeenCalledWith('user1');
    expect(shareRepo.findShareFoldersByUserId).toHaveBeenCalledWith('user1');
    expect(result).toEqual({
      folders: myFolders,
      sharedFolders,
    });
  });

  it('📌 레포지토리 오류가 나면 예외를 전파한다', async () => {
    folderRepo.getFoldersByUserId.mockRejectedValue(new Error('DB down'));

    await expect(usecase.execute('user1')).rejects.toThrow('DB down');

    expect(shareRepo.findShareFoldersByUserId).not.toHaveBeenCalled();
  });
});
