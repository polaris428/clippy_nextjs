'use client';

import { signInWithGoogle } from '@/lib/firebase/signInWithGoogle';
import { CDSButton } from '@/components/design-system';

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const token = await signInWithGoogle();

      if (!token) {
        console.error('❌ 로그인 실패: 토큰 없음');
        return;
      }

      const userInfo = JSON.parse(atob(token.split('.')[1])); // Firebase JWT decode
      const name = userInfo.name || '익명';

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

      const data = await res.json();
      console.log('✅ 로그인 성공:', data);

      localStorage.setItem('token', token);
      window.location.href = '/folders';
    } catch (err) {
      console.error('🔥 로그인 중 예외 발생:', err);
    }
  };

  return <CDSButton buttonText="무료로 사용하기" onClick={handleLogin} />;
}