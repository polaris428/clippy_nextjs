'use client';

export const useFolderShareActions = () => {
  /**
   * 폴더 공유 활성화 및 공유 키 반환
   */
  const shareFolder = async (folderId: string, isShared: boolean): Promise<string | null> => {
    try {
      const res = await fetch(`/api/folders/${folderId}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isShared: isShared }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ 공유 실패:', data);
        return null;
      }

      return data.shareKey ?? null;
    } catch (err) {
      console.error('🔥 공유 중 예외 발생:', err);
      return null;
    }
  };

  /**
   * 초대 코드로 폴더 참가
   */
  const joinFolder = async (inviteCode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/folders/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ inviteCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('❌ 초대 실패:', data?.error ?? '초대 실패');
        return false;
      }

      return true;
    } catch (err) {
      console.error('🔥 초대 중 예외 발생:', err);
      return false;
    }
  };

  return { shareFolder, joinFolder };
};
