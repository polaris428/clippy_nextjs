import 'reflect-metadata';
import { PostUpdateFolderUsecase } from '@/application/usecases/folder/PostUpdateFolderUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import type { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
import { NotFoundError } from '@/lib/errors/NotFoundError';

describe('PostUpdateFolderUsecase', () => {
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

  const usecase = new PostUpdateFolderUsecase(repo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 소유자가 요청하면 폴더를 업데이트하고 결과를 반환한다', async () => {
    const folderId = 'f1';
    const ownerId = 'user1';

    const existingFolder: Folder = {
      id: folderId,
      name: 'Old Name',
      ownerId,
      isShared: false,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };

    const updateDto: FolderUpdateDto = {
      name: 'New Name',
      isShared: true,
    };

    const updatedFolder: Folder = {
      ...existingFolder,
      ...updateDto,
    };

    repo.findById.mockResolvedValue(existingFolder);
    repo.updateFolder.mockResolvedValue(updatedFolder);

    const result = await usecase.execute({
      userId: ownerId,
      folderId,
      data: updateDto,
    });

    expect(repo.findById).toHaveBeenCalledWith(folderId);
    expect(repo.updateFolder).toHaveBeenCalledWith({ id: folderId, data: updateDto });
    expect(result).toEqual(updatedFolder);
  });

  it('📌 폴더가 없거나 소유자가 아니면 NotFoundError', async () => {
    // 케이스 A: 폴더 자체를 찾지 못함
    repo.findById.mockResolvedValue(null);

    await expect(
      usecase.execute({
        userId: 'userX',
        folderId: 'non-existent',
        data: { name: 'irrelevant' },
      })
    ).rejects.toEqual(new NotFoundError('폴더를 찾을 수 없습니다.'));

    // 케이스 B: 폴더는 찾았지만 ownerId가 다름
    const folder: Folder = {
      id: 'f2',
      name: 'Other',
      ownerId: 'anotherUser',
      isShared: false,
      isInvite: false,
      isTemp: false,
      createdAt: new Date(),
      links: [],
    };
    repo.findById.mockResolvedValue(folder);

    await expect(
      usecase.execute({
        userId: 'userX',
        folderId: 'f2',
        data: { name: 'irrelevant' },
      })
    ).rejects.toEqual(new NotFoundError('폴더를 찾을 수 없습니다.'));
  });
});
