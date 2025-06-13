import { Folder } from '@/types/folder/folder';
import { FolderPermission } from '@prisma/client';
import { SharedUser } from '@/types/shear/shared-user';
export interface IShareFolderRepository {
  /**
   * 유저의 공유받은 전체체 폴더 조회
   */
  findShareFoldersByUserId(userId: string): Promise<Folder[]>;
  delete(userId: string, folderId: string): Promise<void>;
  /**
   * 초대 코드로 폴더 조회
   */
  findByInviteCode(inviteCode: string): Promise<Folder | null>;

  /**
   * 초대 코드 업데이트 (초대 활성화/비활성화 포함)
   */
  updateInviteCode(data: { folderId: string; isInvite: boolean; inviteCode: string }): Promise<void>;

  /**
   * 협업자 추가 (초대 수락 시 자동 등록됨)
   */
  addCollaborator(data: { folderId: string; userId: string }): Promise<void>;

  /**
   * 협업자의 권한 수정 (예: READ → WRITE)
   */
  updateCollaboratorPermission(folderId: string, userId: string, permission: FolderPermission): Promise<void>;

  findUsersByFolderId(folderId: string): Promise<SharedUser[]>;
}
