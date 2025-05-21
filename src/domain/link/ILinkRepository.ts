export interface ILinkRepository {
  deleteLink(linkId: string, userId: string): Promise<void>;
  createLink(data: { title: string; url: string; folderId: string; userId: string }): Promise<void>;
}
