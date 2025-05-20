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

      const token = await user.getIdToken(); // Firebase에서 JWT 발급
      const name = user.displayName || '익명';

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

      const { folders } = await res.json();
      const firstFolderId = folders?.[0]?.id;
      console.log(folders)
      // ✅ 서버에서 받은 폴더 ID로 라우팅
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
