import type { ILinkRepository } from '@/domain/link/ILinkRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteLink {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute(linkId: string, userId: string): Promise<void> {
    await this.linkRepository.deleteLink(linkId, userId);
  }
}
