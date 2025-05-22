'use client';

import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase/signInWithGoogle';
import { PrimaryButton } from "@/components/design-system";
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const googleUser = await signInWithGoogle();
      if (!googleUser) return;

      const token = await googleUser.getIdToken(); // Firebase에서 JWT 발급
      const name = googleUser.displayName || '익명';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
        credentials: 'include', // ✅ 쿠키로 저장하려면 꼭 필요
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ 로그인 API 실패:', text);
        return;
      }

      const body = await res.json()
      const { user, folders, sharedFolders } = body
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setFolders(folders);
      useAuthStore.getState().setSharedFolders(sharedFolders);

      const firstFolderId = folders?.[0]?.id;


      if (firstFolderId) {
        console.log("folders")
        router.push(`/folders/${encodeURIComponent(firstFolderId)}`);
      } else {
        console.log("no-folders")
        router.push('/no-folders');
      }
    } catch (err) {
      console.error('🔥 로그인 중 예외 발생:', err);
    }
  };

  return <PrimaryButton buttonText="무료로 사용하기" onClick={handleLogin} />;
}
