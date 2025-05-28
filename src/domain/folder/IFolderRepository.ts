import { Folder } from '../../types/folder/folder';

export interface IFolderRepository {
  /**
   * 폴더 생성
   */
  createFolder(userId: string, name: string, isShared?: boolean): Promise<Folder>;

  /**
   * 유저의 전체 폴더 조회
   */
  findFoldersByUserId(userId: string): Promise<Folder[]>;

  /**
   * 유저의 공유받은 전체체 폴더 조회
   */
  findShareFoldersByUserId(userId: string): Promise<Folder[]>;

  /**
   * 단일 폴더 조회
   */
  findById(folderId: string): Promise<Folder | null>;
  /**
   * 단일 공유
   */
  updateShare(folderId: string, data: { isShared: boolean; shareKey: string | null }): Promise<void>;

  findByInviteCode(inviteCode: string): Promise<Folder | null>;
  addCollaborator(data: { folderId: string; userId: string }): Promise<void>;
  updateInviteCode(data: { folderId: string; isInvite: boolean; inviteCode: string }): Promise<void>;
}
