import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserService } from '@/services/UserService';
import { User } from '@/types/auth/user';

export function useFetchCurrentUserData(user: User | null) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUserData = async () => {
        try {
          const data = await UserService.getMe();
          const store = useAuthStore.getState();
          store.setUser(data.user);
          store.setFolders(data.folders);
          store.setSharedFolders(data.sharedFolders);
        } catch {
          router.replace('/');
        }
      };

      fetchUserData();
    }
  }, [user, router]);
}
