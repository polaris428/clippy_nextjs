// src/hooks/folder/useCreateFolder.ts
import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';
import { useRouter } from 'next/navigation';
export function useCreateFolder() {
  const addFolder = useAuthStore(s => s.addFolder);
  const updateFolder = useAuthStore(s => s.updateFolder);
  //const removeFolder = useAuthStore(s => s.removeFolder);

  const router = useRouter();
  const createFolder = async (name: string, isShared: boolean) => {
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
    };

    addFolder(optimisticFolder);

    try {
      const newFolder = await FolderService.createfolder(name, isShared);
      //TODO : ID 업데이트가 반영이 안됨
      updateFolder(tempId, newFolder);
      const currentPath = window.location.pathname;
      if (currentPath.includes(`/folders/${tempId}`)) {
        router.replace(`/folders/${newFolder.id}`);
      }
    } catch (err) {
      console.error('🔥 폴더 생성 실패:', err);
      //removeFolder(tempId);
      throw err;
    }
  };

  return { createFolder };
}
