// store/useAuthStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Folder {
  id: string;
  name: string;
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
