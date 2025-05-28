import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';
import { UserService } from '@/services/UserService';
export function useFolderPageActions(folderId: string) {
  const fetchFolder = async () => {
    const data = await UserService.getMe();
    useAuthStore.getState().setFolders(data.folders);
  };

  const generateInviteCode = async () => {
    console.log('kljsdflkj;sdfk;ljadflk');
    const code = await FolderService.generateInviteCode(folderId);
    await navigator.clipboard.writeText(code);
  };

  return { fetchFolder, generateInviteCode };
}
