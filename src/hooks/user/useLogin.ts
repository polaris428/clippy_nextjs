// hooks/auth/useLogin.ts
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
      // 1. Firebase 로그인 → Google 사용자
      const googleUser = await signInWithGoogle();
      if (!googleUser) return;

      // 2. ID 토큰 가져오기
      const token = await googleUser.getIdToken();

      // 3. UserService로 API 호출
      const { user, folders, sharedFolders }: LoginResponse = await UserService.postLogIn(token);

      // 4. 상태 저장
      const store = useAuthStore.getState();
      store.setUser(user);
      store.setFolders(folders);
      store.setSharedFolders(sharedFolders);

      // 5. 첫 폴더로 이동
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
