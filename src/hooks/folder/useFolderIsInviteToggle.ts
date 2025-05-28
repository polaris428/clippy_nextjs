import { useState } from 'react';
import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
interface UseFolderInviteTogglerops {
  folderId: string;
  initialInvite: boolean;
  initiaInviteKey: string;
}

export function useFolderIsInviteToggle({ folderId, initialInvite, initiaInviteKey }: UseFolderInviteTogglerops) {
  const [isShared, setIsShared] = useState(initialInvite);
  const [loading, setLoading] = useState(false);
  const [shareKey, setShareKey] = useState(initiaInviteKey);
  const updateFolder = useAuthStore(s => s.updateFolder);
  const toggleShare = async (isShared: boolean) => {
    setLoading(true);
    try {
      const shareKey = await FolderService.shareFolder(folderId, isShared);
      setIsShared(isShared);
      updateFolder(folderId, {
        isShared: isShared,
        shareKey: isShared && shareKey ? `${shareKey}` : '',
      });
      if (isShared && shareKey) {
        setShareKey(`${shareKey}`);
      } else if (!isShared) {
        setShareKey(``);
      }
    } catch (err) {
      console.error('공유 상태 변경 실패:', err);
      setShareKey(``);
    } finally {
      setLoading(false);
    }
  };

  return {
    isShared,
    loading,
    shareKey,
    toggleShare,
  };
}
