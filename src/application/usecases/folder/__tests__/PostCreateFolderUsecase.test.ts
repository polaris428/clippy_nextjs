import 'reflect-metadata';
import { PostCreateFolderUsecase } from '@/application/usecases/folder/PostCreateFolderUsecase';
import type { IFolderRepository } from '@/domain/repositories/folder/IFolderRepository';

describe('PostCreateFolderUsecase', () => {
  // ❶ 모든 IFolderRepository 메서드를 jest.fn()으로 채운 가짜 객체
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

  // ❷ 유스케이스 인스턴스 (DI 컨테이너 건너뛰고 직접 주입)
  const usecase = new PostCreateFolderUsecase(repo);

  beforeEach(() => jest.clearAllMocks()); // 매 테스트마다 mock 초기화

  it('createFolder를 호출하고 그대로 값을 돌려준다', async () => {
    const dto = { name: 'Test', ownerId: 'u1', isShared: true };
    const folder = {
      id: 'f1',
      name: 'Test',
      ownerId: 'u1',
      isShared: true,
      createdAt: new Date(),
      links: [],
      isInvite: false,
      isTemp: false,
    };

    repo.createFolder.mockResolvedValue(folder);

    const result = await usecase.execute(dto);

    expect(repo.createFolder).toHaveBeenCalledWith(dto);
    expect(result).toEqual(folder);
  });

  it('레포지토리에서 오류가 나면 그대로 throw한다', async () => {
    repo.createFolder.mockRejectedValue(new Error('DB down'));

    await expect(usecase.execute({ name: 'Oops', ownerId: 'u1' })).rejects.toThrow('DB down');
  });
});
