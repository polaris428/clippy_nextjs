import { fetchWithFirebaseRetry } from '@/lib/utils/fetchWithAuthRetry';
export const FolderService = {
  async createFolder(name: string, isShared: boolean) {
    const res = await fetchWithFirebaseRetry('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, isShared }),
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

  async updateFolder(folderId: string, update: { name?: string; color?: string; description?: string; isShared?: boolean }) {
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(update),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('🔥 폴더 업데이트 실패:', data.error);
        throw new Error(data.error || '폴더 수정 실패');
      }

      return data;
    } catch (err) {
      console.error('🔥 폴더 수정 요청 중 오류 발생:', err);
      throw err;
    }
  },

  async getFolderById(id: string) {
    const res = await fetch(`/api/folders/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('폴더 조회 실패');
    return await res.json();
  },

  async generateInviteCode(id: string, isInvite: boolean): Promise<string> {
    const res = await fetch(`/api/folders/${id}/invite`, {
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

  async shareFolder(id: string, isShared: boolean): Promise<string | null> {
    const res = await fetch(`/api/folders/${id}/share`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isShared }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.shareKey;
  },

  async joinFolder(inviteCode: string): Promise<{ success: boolean; folderId?: string; error?: string }> {
    try {
      const res = await fetch('/api/folders/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inviteCode }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error('❌ 초대 실패:', json.error || '알 수 없는 오류');
        return { success: false, error: json.error || '폴더 참가 실패' };
      }

      return { success: true, folderId: json.folderId };
    } catch (err) {
      console.error('❌ 초대 요청 중 예외 발생:', err);
      return { success: false, error: '네트워크 오류 또는 서버 예외' };
    }
  },
};
