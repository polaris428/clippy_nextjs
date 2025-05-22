import { create } from 'zustand';
import { Folder } from '@/domain/folder/Folder';
import { User } from '@/domain/user/User';

interface AuthStore {
  user: User | null;
  folders: Folder[];
  sharedFolders: Folder[];
  setUser: (user: User) => void;
  setFolders: (folders: Folder[]) => void;
  setSharedFolders: (folders: Folder[]) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  folders: [],
  sharedFolders: [],
  setUser: user => set({ user }),
  setFolders: folders => set({ folders }),
  setSharedFolders: folders => set({ folders }),
}));
