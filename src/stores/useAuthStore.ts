import { create } from 'zustand';
import { Folder } from '@/types/folder/folder';
import { User } from '@/types/auth/user';
import { SharedFolder } from '@/types/folder/sharedFolder';
interface AuthStore {
  user: User | null;
  folders: Folder[];
  sharedFolders: SharedFolder[];
  setUser: (user: User) => void;
  setFolders: (folders: Folder[]) => void;
  setSharedFolders: (folders: SharedFolder[]) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  folders: [],
  sharedFolders: [],
  setUser: user => set({ user }),
  setFolders: folders => set({ folders }),
  setSharedFolders: sharedFolders => set({ sharedFolders }),
  updateFolder: (id, updates) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === id ? { ...f, ...updates } : f)),
    })),
}));
