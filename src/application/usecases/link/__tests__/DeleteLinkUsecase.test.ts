import 'reflect-metadata';
import { DeleteLinkUsecase } from '@/application/usecases/link/DeleteLinkUsecase';
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';

describe('DeleteLinkUsecase', () => {
  const linkRepo: jest.Mocked<ILinkRepository> = {
    findById: jest.fn(),
    checkAccess: jest.fn(),
    deleteLink: jest.fn(),
    createLink: jest.fn(),
    updateLink: jest.fn(),
  };

  const usecase = new DeleteLinkUsecase(linkRepo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 deleteLink를 호출하여 링크를 삭제한다', async () => {
    linkRepo.deleteLink.mockResolvedValue(undefined);

    await usecase.execute('link123', 'user1');

    expect(linkRepo.deleteLink).toHaveBeenCalledWith('link123', 'user1');
  });

  it('📌 레포지토리에서 오류 발생 시 그대로 throw한다', async () => {
    linkRepo.deleteLink.mockRejectedValue(new Error('DB Error'));

    await expect(usecase.execute('link123', 'user1')).rejects.toThrow('DB Error');
  });
});
