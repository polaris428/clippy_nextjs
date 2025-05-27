// hooks/useFolderShareToggle.ts
import { useState } from 'react';
import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
interface UseFolderShareToggleProps {
  folderId: string;
  initialShared: boolean;
  initiaShareKey: string;
}

export function useFolderShareToggle({ folderId, initialShared, initiaShareKey }: UseFolderShareToggleProps) {
  const [isShared, setIsShared] = useState(initialShared);
  const [loading, setLoading] = useState(false);
  const [shareKey, setShareKey] = useState(initiaShareKey);
  const updateFolder = useAuthStore(s => s.updateFolder);
  const toggleShare = async (isShared: boolean) => {
    setLoading(true);
    try {
      const shareKey = await FolderService.shareFolder(folderId, isShared);
      setIsShared(isShared);
      updateFolder(folderId, {
        isShared: isShared,
        shareKey: isShared && shareKey ? `${window.location.origin}/shared/${shareKey}` : '',
      });
      if (isShared && shareKey) {
        setShareKey(`${window.location.origin}/shared/${shareKey}`);
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
