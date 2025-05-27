import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';

export function useFolderPageActions(folderId: string) {
  const fetchFolder = async () => {
    const data = await FolderService.getFolderById(folderId);
    useAuthStore.getState().setFolders(data.folders);
  };

  const generateInviteCode = async () => {
    const code = await FolderService.generateInviteCode(folderId);
    await navigator.clipboard.writeText(code);
    alert(`초대 코드가 복사되었습니다:\n${code}`);
  };

  const shareFolder = async (isShared: boolean) => {
    const shareKey = await FolderService.shareFolder(folderId, isShared);
    if (isShared) {
      if (shareKey) {
        alert(`공유 링크: ${window.location.origin}/shared/${shareKey}`);
      } else {
        alert('공유 실패');
      }
    } else {
      alert('공유가 해제되었습니다.');
    }
  };

  return { fetchFolder, generateInviteCode, shareFolder };
}
