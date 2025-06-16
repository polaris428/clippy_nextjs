import 'reflect-metadata';
import { PostDeleteFolderUsecase } from '@/application/usecases/folder/PostDeleteFolderUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';
import type { Folder } from '@/types/folder/folder';

describe('PostDeleteFolderUsecase', () => {
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

  const usecase = new PostDeleteFolderUsecase(folderRepo, shareRepo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 사용자가 소유한 폴더를 삭제하면 isShared=false 로 반환한다', async () => {
    const myFolder: Folder = {
      id: 'f1',
      name: 'My Folder',
      ownerId: 'user1',
      isShared: false,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    folderRepo.getFoldersByUserId.mockResolvedValue([myFolder]);
    folderRepo.deleteFolder.mockResolvedValue();

    const result = await usecase.execute('user1', 'f1');

    expect(folderRepo.deleteFolder).toHaveBeenCalledWith('f1');
    expect(shareRepo.delete).not.toHaveBeenCalled();
    expect(result).toEqual({ deletedFolder: myFolder, isShared: false });
  });

  it('📌 공유받은 폴더를 삭제하면 isShared=true 로 반환한다', async () => {
    // 소유 폴더는 없음
    folderRepo.getFoldersByUserId.mockResolvedValue([]);

    const sharedFolder: Folder = {
      id: 'sf1',
      name: 'Team Folder',
      ownerId: 'owner1',
      isShared: true,
      isInvite: true,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    shareRepo.findShareFoldersByUserId.mockResolvedValue([sharedFolder]);
    shareRepo.delete.mockResolvedValue();

    const result = await usecase.execute('user2', 'sf1');

    expect(shareRepo.delete).toHaveBeenCalledWith('user2', 'sf1');
    expect(folderRepo.deleteFolder).not.toHaveBeenCalled();
    expect(result).toEqual({ deletedFolder: sharedFolder, isShared: true });
  });

  it('📌 소유·공유 폴더가 모두 없으면 403 ForbiddenError', async () => {
    folderRepo.getFoldersByUserId.mockResolvedValue([]);
    shareRepo.findShareFoldersByUserId.mockResolvedValue([]);

    await expect(usecase.execute('userX', 'unknown')).rejects.toEqual(new ForbiddenError('해당 폴더에 대한 삭제 권한이 없습니다.'));

    expect(folderRepo.deleteFolder).not.toHaveBeenCalled();
    expect(shareRepo.delete).not.toHaveBeenCalled();
  });
});
