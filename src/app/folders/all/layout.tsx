'use client';

import Sidebar from '@/components/sidebar/Sidebar';
import AppHeader from '@/components/Header/AppHeader';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFetchCurrentUserData } from '@/hooks/user/useFetchCurrentUserData';



export default function FolderLayoutClient({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.user);
  useFetchCurrentUserData(currentUser);
  if (!currentUser) {
    return null
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader userImageUrl={currentUser!.profileImage ?? ''} />
      <div className="flex flex-1 overflow-y-auto">
        <aside className="w-80 flex-shrink-0 h-full overflow-y-auto">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
