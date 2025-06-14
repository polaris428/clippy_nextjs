import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteLinkUsecase {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute(linkId: string, userId: string): Promise<void> {
    await this.linkRepository.deleteLink(linkId, userId);
  }
}
