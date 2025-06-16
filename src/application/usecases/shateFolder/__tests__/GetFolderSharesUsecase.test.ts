import 'reflect-metadata';
import { GetFolderSharesUsecase } from '@/application/usecases/shateFolder/GetFolderSharesUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { IShareFolderRepository } from '@/domain/repositories/share-folder/IShareFolderRepository';
import { ForbiddenError } from '@/lib/errors/ForbiddenError';
import { NotFoundError } from '@/lib/errors/NotFoundError';

describe('GetFolderSharesUsecase', () => {
  const folderRepo: jest.Mocked<IFolderRepository> = {
    createFolder: jest.fn(),
    getFoldersByUserId: jest.fn(),
    findById: jest.fn(),
    updateFolder: jest.fn(),
    findByInviteCode: jest.fn(),
    addCollaborator: jest.fn(),
    updateInviteCode: jest.fn(),
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

  const usecase = new GetFolderSharesUsecase(folderRepo, shareRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('📌 정상적으로 공유 사용자 목록을 반환한다', async () => {
    folderRepo.findById.mockResolvedValue({
      id: 'f1',
      ownerId: 'u1',
      name: 'Test',
      isShared: true,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    });

    shareRepo.findUsersByFolderId.mockResolvedValue([
      { userId: 'u2', email: 'a@example.com', permission: 'READ' },
      { userId: 'u3', email: 'b@example.com', permission: 'WRITE' },
    ]);

    const result = await usecase.execute({ userId: 'u1', folderId: 'f1' });

    expect(result).toEqual([
      { userId: 'u2', email: 'a@example.com', permission: 'READ' },
      { userId: 'u3', email: 'b@example.com', permission: 'WRITE' },
    ]);
  });

  it('📌 폴더가 존재하지 않으면 예외를 던진다', async () => {
    folderRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute({ userId: 'u1', folderId: 'not-found' })).rejects.toThrow(NotFoundError);
  });

  it('📌 폴더 소유자가 아닌 경우 예외를 던진다', async () => {
    folderRepo.findById.mockResolvedValue({
      id: 'f1',
      ownerId: 'owner-id',
      name: 'Test',
      isShared: true,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    });

    await expect(usecase.execute({ userId: 'intruder', folderId: 'f1' })).rejects.toThrow(ForbiddenError);
  });
});
