// src/stores/useAuthStore.ts

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
  addFolder: (folder: Folder) => void; // ✅ 추가
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
  setSharedFolders: sharedFolders => set({ sharedFolders }),
  updateFolder: (id, updates) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === id ? { ...f, ...updates } : f)),
    })),
  addLinkToFolder: (folderId, newLink) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === folderId ? { ...f, links: [...(f.links || []), newLink] } : f)),
    })),
}));
