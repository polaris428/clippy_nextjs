import 'reflect-metadata';
import '@/infrastructure/di/container';

import type { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { Link } from '@/types/links/link';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetLinkByIdUseCase {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute(linkId: string): Promise<Link> {
    const link = await this.linkRepository.findById(linkId);
    if (!link) throw new Error('링크를 찾을 수 없습니다');
    return link;
  }
}
