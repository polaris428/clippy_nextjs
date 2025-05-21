export const useShareFolder = () => {
  const shareFolder = async (folderId: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/folders/${folderId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isShared: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('❌ 공유 실패:', data);
        throw new Error('공유 실패');
      }

      return data.shareKey; // ✅ 공유 링크 반환
    } catch (err) {
      console.error('🔥 공유 중 예외 발생:', err);
      return null;
    }
  };

  return { shareFolder };
};
