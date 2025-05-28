import { useAuthStore } from '@/stores/useAuthStore';
import { UserService } from '@/services/UserService';
export function useFolderPageActions() {
  const fetchFolder = async () => {
    const data = await UserService.getMe();
    useAuthStore.getState().setFolders(data.folders);
  };

  return { fetchFolder };
}
