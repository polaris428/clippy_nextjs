import { inject, injectable } from 'tsyringe';
import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { Link } from '@/types/links/link';

@injectable()
export class UpdateLinkUsecase {
  constructor(@inject('ILinkRepository') private repo: ILinkRepository) {}

  async execute(linkId: string, userId: string, data: { title?: string; description?: string; isPin?: boolean }): Promise<Link> {
    await this.repo.checkAccess(linkId, userId);
    return this.repo.updateLink(linkId, data);
  }
}
