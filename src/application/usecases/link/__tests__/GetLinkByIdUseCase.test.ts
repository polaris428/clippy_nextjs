import 'reflect-metadata';
import { GetLinkByIdUseCase } from '@/application/usecases/link/GetLinkByIdUseCase';
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { Link } from '@/types/links/link';

describe('GetLinkByIdUseCase', () => {
  const repo: jest.Mocked<ILinkRepository> = {
    findById: jest.fn(),
    checkAccess: jest.fn(),
    deleteLink: jest.fn(),
    createLink: jest.fn(),
    updateLink: jest.fn(),
  };

  const usecase = new GetLinkByIdUseCase(repo);

  beforeEach(() => jest.clearAllMocks());

  it('📌 링크를 정상적으로 반환한다', async () => {
    const link: Link = {
      id: 'link1',
      title: 'Test Title',
      url: 'https://example.com',
      description: 'desc',
      folderId: 'f1',
      thumbnail: '',
      favicon: '',
      isPin: false,
      createdAt: new Date(),
    };

    repo.findById.mockResolvedValue(link);

    const result = await usecase.execute('link1');

    expect(repo.findById).toHaveBeenCalledWith('link1');
    expect(result).toEqual(link);
  });

  it('📌 링크를 찾지 못하면 예외를 던진다', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('invalid-link')).rejects.toThrow('링크를 찾을 수 없습니다');
  });
});
