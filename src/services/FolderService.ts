import { fetchWithFirebaseRetry } from '@/lib/utils/fetchWithAuthRetry';
import { Folder } from './../types/folder/folder';
import { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
import { SharedUser } from '@/types/share/shared-user';
import logger from '@/lib/logger/logger';

export const FolderService = {
  async createFolder(name: string, isShared: boolean) {
    const res = await fetchWithFirebaseRetry('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, isShared, isTemp: true }),
    });
    if (!res.ok) {
      throw new Error('폴더 생성 실패');
    }
    return await res.json();
  },

  async deleteFolder(folderId: string) {
    const res = await fetchWithFirebaseRetry(`/api/folders/${folderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ folderId }),
    });
    if (!res.ok) throw new Error('폴더 삭제 실패');
    return await res.json();
  },

  async updateFolder(folderId: string, update: FolderUpdateDto): Promise<Folder> {
    try {
      const res = await fetchWithFirebaseRetry(`/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(update),
      });

      const data = await res.json();

      if (!res.ok) {
        logger.error({ data }, '🔥 폴더 업데이트 실패');
        throw new Error(data.error || '폴더 수정 실패');
      }

      return data.folder;
    } catch (err) {
      logger.error({ err }, '🔥 폴더 수정 요청 중 오류 발생');
      throw err;
    }
  },

  async getFolderById(id: string) {
    const res = await fetchWithFirebaseRetry(`/api/folders/${id}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error('폴더 조회 실패');
    return await data;
  },

  async generateInviteCode(id: string, isInvite: boolean): Promise<string> {
    const res = await fetchWithFirebaseRetry(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isInvite: isInvite }),
    });
    if (!res.ok) throw new Error('초대 코드 생성 실패');
    const data = await res.json();
    return data.inviteCode;
  },

  async joinFolder(inviteCode: string): Promise<{ success: boolean; folderId?: string; error?: string }> {
    const res = await fetchWithFirebaseRetry('/api/folders/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ inviteCode }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      logger.error({ json }, '❌ 초대 실패:');
      return { success: false, error: json.error || '폴더 참가 실패' };
    }

    return { success: true, folderId: json.folderId };
  },

  async fetchShares(folderId: string): Promise<{ users: SharedUser[] }> {
    const res = await fetchWithFirebaseRetry(`/api/folders/${folderId}/shares`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('공유 목록 조회 실패');
    return await res.json();
  },

  async updatePermission(folderId: string, userId: string, permission: 'READ' | 'WRITE') {
    const res = await fetchWithFirebaseRetry(`/api/folders/${folderId}/shares/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ permission }),
    });

    if (!res.ok) {
      const err = await res.json();

      logger.error({ err }, '❌ 권한 변경 실패:');
      throw new Error(err?.error || '권한 변경 실패');
    }
  },
};
