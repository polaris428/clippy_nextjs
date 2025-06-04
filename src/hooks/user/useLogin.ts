import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase/signInWithGoogle';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserService } from '@/services/UserService';
import { useState } from 'react';
import { LoginResponse } from '@/types/auth/loginResponse';

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const googleUser = await signInWithGoogle();
      if (!googleUser) return;

      const token = await googleUser.getIdToken();

      const { user, folders, sharedFolders }: LoginResponse = await UserService.postLogIn(token);

      const store = useAuthStore.getState();
      store.setUser(user);
      store.setFolders(folders);
      console.log(sharedFolders);
      store.setSharedFolders(sharedFolders);

      const firstFolderId = folders?.[0]?.id;
      router.push(firstFolderId ? `/folders/${encodeURIComponent(firstFolderId)}` : '/no-folders');
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인 실패';
      console.error('🔥 로그인 중 예외 발생:', message);
      setError(message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
