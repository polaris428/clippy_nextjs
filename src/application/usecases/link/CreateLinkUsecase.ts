// src/application/usecases/link/CreateLinkUsecase.ts
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import type { IMetadataScraperService } from '@/domain/services/IMetadataScraperService';
import { inject, injectable } from 'tsyringe';
import { CheckFolderWritePermissionUsecase } from '@/application/usecases/folder/CheckFolderWritePermissionUsecase';

@injectable()
export class CreateLinkUsecase {
  constructor(private readonly checkPerm: CheckFolderWritePermissionUsecase, @inject('ILinkRepository') private linkRepository: ILinkRepository, @inject('IMetadataScraperService') private scraper: IMetadataScraperService) {}

  async execute(cmd: { url: string; title: string; description: string; folderId: string; userId: string }) {
    const { folderId, userId, url } = cmd;

    await this.checkPerm.execute({ folderId, userId });

    const meta = await this.scraper.scrape(url);

    return await this.linkRepository.createLink({
      url,
      title: meta.title ?? '',
      thumbnail: meta.image ?? '',
      favicon: meta.favicon ?? '',
      description: meta.description ?? '',
      folderId,
    });
  }
}
