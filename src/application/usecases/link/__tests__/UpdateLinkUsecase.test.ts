import 'reflect-metadata';
import { UpdateLinkUsecase } from '@/application/usecases/link/UpdateLinkUsecase';
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { Link } from '@/types/links/link';

describe('UpdateLinkUsecase', () => {
  const repo: jest.Mocked<ILinkRepository> = {
    findById: jest.fn(),
    checkAccess: jest.fn(),
    deleteLink: jest.fn(),
    createLink: jest.fn(),
    updateLink: jest.fn(),
  };

  const usecase = new UpdateLinkUsecase(repo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 링크를 업데이트하고 결과를 반환한다', async () => {
    const updated: Link = {
      id: 'l1',
      title: 'New Title',
      url: 'https://example.com',
      description: 'Updated Desc',
      folderId: 'f1',
      thumbnail: '',
      favicon: '',
      isPin: true,
      createdAt: new Date(),
    };

    repo.updateLink.mockResolvedValue(updated);

    const result = await usecase.execute('l1', 'u1', {
      title: 'New Title',
      description: 'Updated Desc',
      isPin: true,
    });

    expect(repo.checkAccess).toHaveBeenCalledWith('l1', 'u1');
    expect(repo.updateLink).toHaveBeenCalledWith('l1', {
      title: 'New Title',
      description: 'Updated Desc',
      isPin: true,
    });
    expect(result).toEqual(updated);
  });

  it('📌 접근 권한이 없으면 예외를 던진다', async () => {
    repo.checkAccess.mockRejectedValue(new Error('Forbidden'));

    await expect(usecase.execute('l1', 'u1', { title: 'Fail' })).rejects.toThrow('Forbidden');

    expect(repo.updateLink).not.toHaveBeenCalled();
  });
});
