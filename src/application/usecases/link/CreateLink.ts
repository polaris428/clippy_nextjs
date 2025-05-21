import type { ILinkRepository } from '@/domain/link/ILinkRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateLink {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute({ title, url, folderId, userId }: { title: string; url: string; folderId: string; userId: string }) {
    await this.linkRepository.createLink({ title, url, folderId, userId });
  }
}
