import 'reflect-metadata';
import { GetFolderIdUsecase } from '../GetFolderIdUsecase';
import { NotFoundError } from '@/lib/errors/NotFoundError';

import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';

describe('GetFolderIdUsecase', () => {
  const repo: jest.Mocked<IFolderRepository> = {
    createFolder: jest.fn(),
    getFoldersByUserId: jest.fn(),
    findById: jest.fn(),
    updateFolder: jest.fn(),
    findByInviteCode: jest.fn(),
    addCollaborator: jest.fn(),
    updateInviteCode: jest.fn(),
    deleteFolder: jest.fn(),
  };
  const usecase = new GetFolderIdUsecase(repo);

  beforeEach(() => {
    repo.findById.mockReset();
  });

  it('returns folder when found and owner matches', async () => {
    const folder: Folder = {
      id: '1',
      name: 'test',
      ownerId: 'u1',
      isShared: false,
      createdAt: new Date(),
      links: [],
      isInvite: false,
      isTemp: false,
      inviteCode: null,
      shareKey: null,
    };
    repo.findById.mockResolvedValue(folder);
    await expect(usecase.execute({ userId: 'u1', folderId: '1' })).resolves.toEqual({ folder });
  });

  it('throws NotFoundError when folder missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(usecase.execute({ userId: 'u1', folderId: '1' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when user not owner', async () => {
    const folder: Folder = {
      id: '1',
      name: 'test',
      ownerId: 'u2',
      isShared: false,
      createdAt: new Date(),
      links: [],
      isInvite: false,
      isTemp: false,
      inviteCode: null,
      shareKey: null,
    };
    repo.findById.mockResolvedValue(folder);
    await expect(usecase.execute({ userId: 'u1', folderId: '1' })).rejects.toBeInstanceOf(NotFoundError);
  });
});
