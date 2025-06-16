import 'reflect-metadata';
import { PatchUpdateFolderUsecase } from '@/application/usecases/folder/PatchUpdateFolderUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';
import type { Folder } from '@/types/folder/folder';
import type { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';

describe('PatchUpdateFolderUsecase', () => {
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

  const usecase = new PatchUpdateFolderUsecase(repo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 updateFolder를 호출하고 결과를 반환한다', async () => {
    const folderId = 'f123';
    const updateData: FolderUpdateDto = {
      name: 'New Folder Name',
      isShared: true,
      isTemp: false,
      isInvite: true,
    };

    const updatedFolder: Folder = {
      id: folderId,
      name: 'New Folder Name',
      isShared: true,
      isTemp: false,
      isInvite: true,
      ownerId: 'user1',
      createdAt: new Date(),
      links: [],
    };

    repo.updateFolder.mockResolvedValue(updatedFolder);

    const result = await usecase.execute({ folderId, data: updateData });

    expect(repo.updateFolder).toHaveBeenCalledWith({ id: folderId, data: updateData });
    expect(result).toEqual(updatedFolder);
  });

  it('📌 updateFolder에서 에러가 발생하면 예외를 전파한다', async () => {
    repo.updateFolder.mockRejectedValue(new Error('Update failed'));

    await expect(
      usecase.execute({
        folderId: 'f123',
        data: { name: 'Broken Folder' },
      })
    ).rejects.toThrow('Update failed');
  });
});
