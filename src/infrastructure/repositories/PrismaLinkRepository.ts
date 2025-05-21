import { prisma } from '@/lib/prisma';
import { ILinkRepository } from '@/domain/link/ILinkRepository';
import { injectable } from 'tsyringe';
@injectable()
export class PrismaLinkRepository implements ILinkRepository {
  async deleteLink(linkId: string, userId: string): Promise<void> {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { folder: true },
    });
    if (!link) throw new Error('링크 없음');
    console.log('folder.ownerId:', link.folder.ownerId, 'userId:', userId);
    // if (!link || link.folder.ownerId !== userId) {
    //   throw new Error('Forbidden');
    // }

    await prisma.link.delete({ where: { id: linkId } });
  }
  async createLink({ title, url, folderId, userId }: { title: string; url: string; folderId: string; userId: string }): Promise<void> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folder) {
      throw new Error('Folder not found');
    }

    if (!folder || folder.ownerId !== userId) {
      throw new Error('Forbidden');
    }

    await prisma.link.create({
      data: { title, url, folderId },
    });
  }
}
