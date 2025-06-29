import { Link } from '@/types/links/link';

export interface ILinkRepository {
  findById(id: string): Promise<Link | null>;
  checkAccess(linkId: string, userId: string): Promise<void>;
  deleteLink(linkId: string, userId: string): Promise<void>;
  createLink(data: { url: string; title: string; thumbnail: string; favicon: string; folderId: string; description: string }): Promise<Link>;
  updateLink(
    linkId: string,
    data: {
      title?: string;
      description?: string;
      isPin?: boolean;
    }
  ): Promise<Link>;
}
