import 'reflect-metadata';
import { CreateLinkUsecase } from '@/application/usecases/link/CreateLinkUsecase';
import { CheckFolderWritePermissionUsecase } from '@/application/usecases/folder/CheckFolderWritePermissionUsecase';
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import type { IMetadataScraperService } from '@/domain/services/IMetadataScraperService';
import type { Link } from '@/types/links/link';

describe('CreateLinkUsecase', () => {
  const mockCheckPerm = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CheckFolderWritePermissionUsecase>;

  const linkRepo: jest.Mocked<ILinkRepository> = {
    findById: jest.fn(),
    checkAccess: jest.fn(),
    deleteLink: jest.fn(),
    createLink: jest.fn(),
    updateLink: jest.fn(),
  };

  const scraper: jest.Mocked<IMetadataScraperService> = {
    scrape: jest.fn(),
  };

  const usecase = new CreateLinkUsecase(mockCheckPerm, linkRepo, scraper);

  beforeEach(() => jest.clearAllMocks());

  it('📌 권한 체크 → 스크래핑 → 링크 저장까지 성공적으로 수행', async () => {
    const cmd = {
      userId: 'user1',
      folderId: 'f1',
      url: 'https://example.com',
      title: 'Ignored title',
      description: 'Ignored desc',
    };

    mockCheckPerm.execute.mockResolvedValue(undefined);

    scraper.scrape.mockResolvedValue({
      title: 'Scraped Title',
      description: 'Scraped Desc',
      image: 'https://example.com/og.png',
      favicon: 'https://example.com/favicon.ico',
    });

    const createdLink: Link = {
      id: 'link123',
      url: cmd.url,
      title: 'Scraped Title',
      description: 'Scraped Desc',
      thumbnail: 'https://example.com/og.png',
      favicon: 'https://example.com/favicon.ico',
      folderId: cmd.folderId,
      createdAt: new Date(),
      isPin: false,
    };

    linkRepo.createLink.mockResolvedValue(createdLink);

    const result = await usecase.execute(cmd);

    expect(mockCheckPerm.execute).toHaveBeenCalledWith({
      folderId: cmd.folderId,
      userId: cmd.userId,
    });

    expect(scraper.scrape).toHaveBeenCalledWith(cmd.url);

    expect(linkRepo.createLink).toHaveBeenCalledWith({
      url: cmd.url,
      title: 'Scraped Title',
      thumbnail: 'https://example.com/og.png',
      favicon: 'https://example.com/favicon.ico',
      description: 'Scraped Desc',
      folderId: cmd.folderId,
    });

    expect(result).toEqual(createdLink);
  });

  it('📌 권한 체크 실패 시 이후 로직을 실행하지 않고 에러 반환', async () => {
    mockCheckPerm.execute.mockRejectedValue(new Error('No permission'));

    await expect(
      usecase.execute({
        userId: 'user1',
        folderId: 'f1',
        url: 'https://example.com',
        title: '',
        description: '',
      })
    ).rejects.toThrow('No permission');

    expect(scraper.scrape).not.toHaveBeenCalled();
    expect(linkRepo.createLink).not.toHaveBeenCalled();
  });
});
