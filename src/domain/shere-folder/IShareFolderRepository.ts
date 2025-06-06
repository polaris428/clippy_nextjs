import { Folder } from '@/types/folder/folder';

export interface IShareFolderRepository {
  /**
   * 유저의 공유받은 전체체 폴더 조회
   */
  findShareFoldersByUserId(userId: string): Promise<Folder[]>;
  delete(userId: string, folderId: string): Promise<void>;
}
