import type { ILinkRepository } from '@/domain/link/ILinkRepository';
import { inject, injectable } from 'tsyringe';
import { scrapeMetadata } from '@/lib/scrapeMetadata';
@injectable()
export class CreateLink {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute({ url, folderId, userId }: { url: string; folderId: string; userId: string }) {
    const metadata = await scrapeMetadata(url);
    console.log('polaris', metadata);
    await this.linkRepository.createLink({ url, title: metadata.title, thumbnail: metadata.image, favicon: metadata.favicon, description: metadata.description, folderId, userId });
  }
}
