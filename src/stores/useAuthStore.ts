import { create } from 'zustand';
import { Folder } from '@/types/folder/folder';
import { User } from '@/types/auth/user';
import { SharedFolder } from '@/types/folder/sharedFolder';
import { Link } from '@/types/links/link';

interface AuthStore {
  user: User | null;
  folders: Folder[];
  sharedFolders: SharedFolder[];
  setUser: (user: User) => void;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  removeFolder: (folderId: string) => void;
  setSharedFolders: (folders: SharedFolder[]) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  addLinkToFolder: (folderId: string, newLink: Link) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  folders: [],
  sharedFolders: [],
  setUser: user => set({ user }),
  setFolders: folders => set({ folders }),
  addFolder: folder =>
    set(state => ({
      folders: [...state.folders, folder],
    })),
  removeFolder: folderId =>
    set(state => {
      console.log('🗑 removeFolder called');
      console.log('📂 folderId:', folderId);
      return {
        folders: state.folders.filter(f => f.id !== folderId),
      };
    }),
  setSharedFolders: sharedFolders => set({ sharedFolders }),
  updateFolder: (id, updates) =>
    set(state => {
      console.log('🛠 updateFolder called');
      console.log('📂 target id:', id);
      console.log('📥 updates:', updates);
      console.log(
        '📂 folders before update:',
        state.folders.map(f => f.id)
      );

      const updated = state.folders.map(f => (f.id === id ? { ...f, ...updates } : f));

      console.log(
        '📂 folders after update:',
        updated.map(f => f.id)
      );

      return { folders: updated };
    }),
  addLinkToFolder: (folderId, newLink) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === folderId ? { ...f, links: [...(f.links || []), newLink] } : f)),
    })),
}));
