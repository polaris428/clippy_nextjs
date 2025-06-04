import { Link } from '@/types/links/link';

export interface ILinkRepository {
  checkAccess(linkId: string, userId: string): Promise<void>;
  deleteLink(linkId: string, userId: string): Promise<void>;
  createLink(data: { url: string; title: string; thumbnail: string; favicon: string; folderId: string; description: string; userId: string }): Promise<void>;
  updateLink(
    linkId: string,
    data: {
      title?: string;
      description?: string;
      isPin?: boolean;
    }
  ): Promise<Link>;
}
