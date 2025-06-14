import { Folder } from '../../../types/folder/folder';
import type { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
export interface IFolderRepository {
  /**
   * 폴더 생성
   */
  createFolder(userId: string, name: string, isShared?: boolean): Promise<Folder>;

  /**
   * 유저의 전체 폴더 조회
   */
  getFoldersByUserId(userId: string): Promise<Folder[]>;

  /**
   * 단일 폴더 조회
   */
  findById(folderId: string): Promise<Folder | null>;
  /**
   * 단일 공유
   */
  updateFolder({ id, data }: { id: string; data: FolderUpdateDto }): Promise<Folder>;
  findByInviteCode(inviteCode: string): Promise<Folder | null>;
  addCollaborator(data: { folderId: string; userId: string }): Promise<void>;
  updateInviteCode(data: { folderId: string; isInvite: boolean; inviteCode: string }): Promise<void>;

  /**
   * 폴더 삭제
   */
  deleteFolder(folderId: string): Promise<void>;
}
