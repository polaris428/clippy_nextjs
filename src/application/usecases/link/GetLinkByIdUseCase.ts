import 'reflect-metadata';
import '@/infrastructure/di/container';

import type { ILinkRepository } from '@/domain/link/ILinkRepository';
import { Link } from '@/types/links/link';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetLinkByIdUseCase {
  constructor(@inject('ILinkRepository') private linkRepository: ILinkRepository) {}

  async execute(linkId: string, userId: string): Promise<Link> {
    console.log(userId);
    console.log('아이디이이', linkId);
    const link = await this.linkRepository.findById(linkId);
    if (!link) throw new Error('링크를 찾을 수 없습니다');
    return link;
  }
}
