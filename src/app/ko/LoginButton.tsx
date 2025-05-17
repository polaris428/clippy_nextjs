'use client';

import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/firebase/signInWithGoogle';
import { PrimaryButton } from "@/components/design-system";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return;

      const token = await user.getIdToken(); // ✅ 자동 갱신됨
      localStorage.setItem('token', token);
      const name = user.displayName || '익명';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ 로그인 API 실패:', text);
        return;
      }

      const { folders } = await res.json();
      localStorage.setItem('folders', JSON.stringify(folders));

      const firstFolderId = folders?.[0]?.id;
      if (firstFolderId) {
        router.push(`/folders/${encodeURIComponent(firstFolderId)}`);
      } else {
        router.push('/no-folders');
      }
    } catch (err) {
      console.error('🔥 로그인 중 예외 발생:', err);
    }
  };

  return <PrimaryButton buttonText="무료로 사용하기" onClick={handleLogin} />;
}
