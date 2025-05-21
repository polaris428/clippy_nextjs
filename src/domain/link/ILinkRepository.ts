export interface ILinkRepository {
  deleteLink(linkId: string, userId: string): Promise<void>;
  createLink(data: { url: string; title: string; thumbnail: string; favicon: string; folderId: string; description: string; userId: string }): Promise<void>;
}
