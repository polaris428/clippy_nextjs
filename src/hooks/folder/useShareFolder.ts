import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
interface UseFolderShareToggleProps {
  folderId: string;
}

export function useFolderShareToggle({ folderId }: UseFolderShareToggleProps) {
  const folder = useAuthStore(s => s.folders.find(f => f.id === folderId));
  const updateFolder = useAuthStore(s => s.updateFolder);

  if (!folder) throw new Error('📂 폴더를 찾을 수 없습니다.');

  const isShared = folder.isShared ?? false;
  const shareKey = folder.shareKey ?? '';

  const toggleShare = async (nextValue: boolean) => {
    try {
      const newShareKey = await FolderService.shareFolder(folderId, nextValue);

      updateFolder(folderId, {
        isShared: nextValue,
        shareKey: nextValue ? newShareKey : '',
      });
    } catch (err) {
      console.error('📛 공유 상태 변경 실패:', err);
      updateFolder(folderId, { isShared: false, shareKey: '' });
    }
  };

  return {
    isShared,
    shareKey,
    toggleShare,
  };
}
