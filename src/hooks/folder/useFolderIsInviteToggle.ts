import { useState } from 'react';
import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
interface UseFolderInviteTogglerops {
  folderId: string;
  initialInvite: boolean;
  initiaInviteKey: string;
}

export function useFolderIsInviteToggle({ folderId, initialInvite, initiaInviteKey }: UseFolderInviteTogglerops) {
  const [isIsInvite, setIsInvite] = useState(initialInvite);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState(initiaInviteKey);
  const updateFolder = useAuthStore(s => s.updateFolder);
  const toggleShare = async (isIsInvite: boolean) => {
    setLoading(true);
    try {
      const shareKey = await FolderService.generateInviteCode(folderId, isIsInvite);

      setIsInvite(isIsInvite);
      updateFolder(folderId, {
        isShared: isIsInvite,
        shareKey: inviteCode && shareKey ? `${shareKey}` : '',
      });
      if (isIsInvite && shareKey) {
        setInviteCode(`${shareKey}`);
      } else if (!isIsInvite) {
        setInviteCode(``);
      }
    } catch (err) {
      console.error('공유 상태 변경 실패:', err);
      setInviteCode(``);
    } finally {
      setLoading(false);
    }
  };

  return {
    isIsInvite,
    loading,
    inviteCode,
    toggleShare,
  };
}
