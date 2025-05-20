import { create } from 'zustand';
import { Folder } from '@/domain/folder/Folder';
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  folders: Folder[];
  setUser: (user: User) => void;
  setFolders: (folders: Folder[]) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  folders: [],
  setUser: user => set({ user }),
  setFolders: folders => set({ folders }),
}));
