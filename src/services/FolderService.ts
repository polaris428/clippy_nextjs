import { fetchWithFirebaseRetry } from '@/lib/utils/fetchWithAuthRetry';
import { Folder } from './../types/folder/folder';
import { FolderUpdateDto } from '@/types/dto/folder/FolderUpdateDto';
import { SharedUser } from '@/types/shear/shared-user';

export const FolderService = {
  async createFolder(name: string, isShared: boolean): Promise<{ newFolder: Folder }> {
    return await fetchWithFirebaseRetry<{ newFolder: Folder }>('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, isShared, isTemp: true }),
    });
  },

  async deleteFolder(folderId: string): Promise<{ success: boolean; deletedFolder: Folder; isShared: boolean }> {
    return await fetchWithFirebaseRetry<{ success: boolean; deletedFolder: Folder; isShared: boolean }>(`/api/folders/${folderId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ folderId }),
    });
  },

  async updateFolder(folderId: string, update: FolderUpdateDto): Promise<Folder> {
    try {
      const data = await fetchWithFirebaseRetry<{ folder: Folder }>(`/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(update),
      });

      return data.folder;
    } catch (err) {
      console.error('🔥 폴더 수정 요청 중 오류 발생:', err);
      throw err;
    }
  },

  async getFolderById(id: string): Promise<{ folder: Folder }> {
    return await fetchWithFirebaseRetry<{ folder: Folder }>(`/api/folders/${id}`, {
      credentials: 'include',
    });
  },

  async generateInviteCode(id: string, isInvite: boolean): Promise<string> {
    const data = await fetchWithFirebaseRetry<{ inviteCode: string }>(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isInvite: isInvite }),
    });
    return data.inviteCode;
  },

  async joinFolder(inviteCode: string): Promise<{ success: boolean; folderId?: string; error?: string }> {
    try {
      const json = await fetchWithFirebaseRetry<{ success: boolean; folderId?: string; error?: string }>('/api/folders/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inviteCode }),
      });

      if (!json.success) {
        console.error('❌ 초대 실패:', json.error || '알 수 없는 오류');
        return { success: false, error: json.error || '폴더 참가 실패' };
      }

      return { success: true, folderId: json.folderId };
    } catch (err) {
      console.error('❌ 초대 요청 중 예외 발생:', err);
      return { success: false, error: '네트워크 오류 또는 서버 예외' };
    }
  },
  async fetchShares(folderId: string): Promise<{ users: SharedUser[] }> {
    return await fetchWithFirebaseRetry<{ users: SharedUser[] }>(`/api/folders/${folderId}/shares`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  async updatePermission(folderId: string, userId: string, permission: 'READ' | 'WRITE') {
    await fetchWithFirebaseRetry<void>(`/api/folders/${folderId}/shares/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ permission }),
    });
  },
};
