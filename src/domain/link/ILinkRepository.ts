export interface ILinkRepository {
  deleteLink(linkId: string, userId: string): Promise<void>;
}
