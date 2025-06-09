import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';
import { useRouter } from 'next/navigation';
import { Folder } from '@/types/folder/folder';

export function useCreateFolder() {
  const addFolder = useAuthStore(s => s.addFolder);
  const updateFolder = useAuthStore(s => s.updateFolder);
  const removeFolder = useAuthStore(s => s.removeFolder);

  const router = useRouter();
  const createFolder = async (name: string, isShared: boolean): Promise<{ newFolder: Folder }> => {
    const tempId = `temp-${Date.now()}`;
    const now = new Date();

    const optimisticFolder = {
      id: tempId,
      name,
      isShared,
      ownerId: 'temp-user',
      createdAt: now,
      isInvite: false,
      links: [],
      inviteCode: null,
      shareKey: null,
      isTemp: true,
    };

    addFolder(optimisticFolder);

    try {
      const { newFolder } = await FolderService.createFolder(name, isShared);

      updateFolder(tempId, newFolder);
      const currentPath = window.location.pathname;
      if (currentPath.includes(`/folders/${tempId}`)) {
        router.replace(`/folders/${newFolder.id}`);
      }
      return { newFolder };
    } catch (err) {
      console.error('🔥 폴더 생성 실패:', err);
      removeFolder(tempId);
      throw err;
    }
  };

  return { createFolder };
}
