import { signInWithGoogle } from '@/lib/firebase/signInWithGoogle';
import logger from '../logger/logger';

export async function loginWithGoogleAndRedirect(): Promise<string | null> {
  const user = await signInWithGoogle();
  if (!user) throw new Error('유저 정보 없음');

  const token = await user.getIdToken();
  const name = user.displayName || '익명';

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();

    logger.error({ text }, '❌ 로그인 API 실패:');
    throw new Error('로그인 실패');
  }

  const { folders } = await res.json();
  return folders?.[0]?.id ?? null;
}
