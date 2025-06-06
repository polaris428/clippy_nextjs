import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
interface UseFolderInviteTogglerops {
  folderId: string;
}

export function useFolderIsInviteToggle({ folderId }: UseFolderInviteTogglerops) {
  const folder = useAuthStore(s => s.folders.find(f => f.id === folderId));
  const updateFolder = useAuthStore(s => s.updateFolder);

  if (!folder) throw new Error('폴더를 찾을 수 없습니다.');

  const isIsInvite = folder.isInvite ?? false;
  const inviteCode = folder.inviteCode ?? '';

  const toggleShare = async (nextValue: boolean) => {
    try {
      const folder = await FolderService.updateFolder(folderId, { isInvite: nextValue });

      updateFolder(folderId, {
        isInvite: nextValue,
        inviteCode: nextValue ? folder.inviteCode : '',
      });
    } catch (err) {
      console.error('초대 상태 변경 실패:', err);
      updateFolder(folderId, { isInvite: false, inviteCode: '' });
    }
  };

  return {
    isIsInvite,
    inviteCode,
    toggleShare,
  };
}
