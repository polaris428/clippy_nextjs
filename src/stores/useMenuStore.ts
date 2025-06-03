import { create } from 'zustand';

interface MenuStore {
  menuOpenFolderId: string | null;
  setMenuOpenFolderId: (id: string | null) => void;
}

export const useMenuStore = create<MenuStore>(set => ({
  menuOpenFolderId: null,
  setMenuOpenFolderId: id => set({ menuOpenFolderId: id }),
}));
