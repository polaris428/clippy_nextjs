import { Folder } from './Folder';

export interface IFolderRepository {
  /**
   * 폴더 생성
   */
  createFolder(
    userId: string,
    name: string,
    isShared?: boolean
  ): Promise<Folder>;

  /**
   * 유저의 전체 폴더 조회
   */
  findFoldersByUserId(userId: string): Promise<Folder[]>;

  /**
   * 단일 폴더 조회
   */
  findById(folderId: string): Promise<Folder | null>;
}
