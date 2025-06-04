import { create } from 'zustand';
import { Folder } from '@/types/folder/folder';
import { User } from '@/types/auth/user';
import { Link } from '@/types/links/link';

interface AuthStore {
  user: User | null;
  folders: Folder[];
  sharedFolders: Folder[];

  setUser: (user: User) => void;
  setFolders: (folders: Folder[]) => void;
  setSharedFolders: (folders: Folder[]) => void;

  addFolder: (folder: Folder) => void;
  removeFolder: (folderId: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;

  addLinkToFolder: (folderId: string, newLink: Link) => void;
  updateLinkInFolder: (folderId: string, linkId: string, updatedLink: Link) => void;
  removeLink: (id: string) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  folders: [],
  sharedFolders: [],

  setUser: user => set({ user }),
  setFolders: folders => set({ folders }),
  setSharedFolders: sharedFolders => set({ sharedFolders }),

  addFolder: folder =>
    set(state => ({
      folders: [...state.folders, folder],
    })),

  removeFolder: folderId =>
    set(state => ({
      folders: state.folders.filter(f => f.id !== folderId),
    })),

  updateFolder: (id, updates) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === id ? { ...f, ...updates } : f)),
    })),

  addLinkToFolder: (folderId, newLink) =>
    set(state => ({
      folders: state.folders.map(f => (f.id === folderId ? { ...f, links: [...(f.links || []), newLink] } : f)),
    })),
  removeLink: linkId =>
    set(state => ({
      folders: state.folders.map(folder => ({
        ...folder,
        links: folder.links?.filter(link => link.id !== linkId) || [],
      })),
    })),
  updateLinkInFolder: (folderId, linkId, updatedLink) =>
    set(state => {
      console.log('🛠 updateLinkInFolder 호출됨');
      console.log('📂 folderId:', folderId);
      console.log('🔗 linkId:', linkId);
      console.log('📦 업데이트 내용:', updatedLink);

      const next = state.folders.map(f =>
        f.id === folderId
          ? {
              ...f,
              links: (f.links || []).map(l => (l.id === linkId ? updatedLink : l)),
            }
          : f
      );

      console.log('🧾 업데이트 후 folders:', next);

      return { folders: next };
    }),
}));
