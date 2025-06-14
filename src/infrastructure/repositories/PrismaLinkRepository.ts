import { prisma } from '@/lib/prisma';
import { ILinkRepository } from '@/domain/repositories/link/ILinkRepository';
import { injectable } from 'tsyringe';
import { Link } from '@/types/links/link';
@injectable()
export class PrismaLinkRepository implements ILinkRepository {
  async checkAccess(linkId: string, userId: string): Promise<void> {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: {
        folder: {
          include: { shares: true },
        },
      },
    });

    if (!link) {
      throw new Response(JSON.stringify({ error: '링크 없음' }), { status: 404 });
    }

    const isShared = link.folder.shares.some(s => s.userId === userId);
    if (link.folder.ownerId !== userId && !isShared) {
      throw new Response(JSON.stringify({ error: '접근 권한 없음' }), { status: 403 });
    }
  }
  async deleteLink(linkId: string, userId: string): Promise<void> {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: { folder: true },
    });
    if (!link) throw new Error('링크 없음');
    console.log('folder.ownerId:', link.folder.ownerId, 'userId:', userId);

    await prisma.link.delete({ where: { id: linkId } });
  }
  async createLink({ title, url, thumbnail, description, favicon, folderId }: { url: string; title: string; thumbnail: string; favicon: string; folderId: string; description: string; userId: string }): Promise<Link> {
    return await prisma.link.create({
      data: { title, url, thumbnail, description, favicon, folderId },
    });
  }

  async updateLink(
    linkId: string,
    data: {
      title?: string;
      description?: string;
      isPin?: boolean;
    }
  ): Promise<Link> {
    return await prisma.link.update({
      where: { id: linkId },
      data,
    });
  }
  async findById(id: string): Promise<Link | null> {
    console.log('아이디', id);
    return await prisma.link.findUnique({
      where: { id },
    });
  }
}
