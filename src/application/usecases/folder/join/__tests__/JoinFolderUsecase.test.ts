import 'reflect-metadata';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import { JoinFolderUsecase } from '../JoinFolderUsecase';

describe('JoinFolderUsecase', () => {
  const repo: jest.Mocked<IFolderRepository> = {
    createFolder: jest.fn(),
    getFoldersByUserId: jest.fn(),
    findById: jest.fn(),
    updateFolder: jest.fn(),
    findByInviteCode: jest.fn(),
    updateInviteCode: jest.fn(),
    addCollaborator: jest.fn(),
    deleteFolder: jest.fn(),
  };

  const usecase = new JoinFolderUsecase(repo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 올바른 초대코드로 참여하면 유저가 폴더에 추가되고 folderId가 반환된다', async () => {
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

    repo.findByInviteCode.mockResolvedValue(folder);
    repo.addCollaborator.mockResolvedValue(); // void 함수

    const result = await usecase.execute({
      inviteCode: 'INV123',
      userId: 'user42',
    });

    expect(repo.findByInviteCode).toHaveBeenCalledWith('INV123');
    expect(repo.addCollaborator).toHaveBeenCalledWith({
      folderId: 'f1',
      userId: 'user42',
    });
    expect(result).toEqual({ folderId: 'f1' });
  });

  it('📌 초대코드가 잘못되면 예외를 던진다', async () => {
    repo.findByInviteCode.mockResolvedValue(null); // ❌ 폴더 없음

    await expect(usecase.execute({ inviteCode: 'INVALID', userId: 'user42' })).rejects.toThrow('Invalid invite code');

    expect(repo.addCollaborator).not.toHaveBeenCalled();
  });
});
