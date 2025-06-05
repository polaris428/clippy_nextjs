import { getAuth } from 'firebase/auth';

export async function fetchWithFirebaseRetry(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('사용자 로그인 안됨');

  const getValidToken = async (forceRefresh = false) => await user.getIdToken(forceRefresh);

  const doFetch = async (idToken: string): Promise<Response> => {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${idToken}`,
      },
      credentials: 'include',
    });

    if (res.status === 401) {
      const contentType = res.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        try {
          const errorJson = await res.clone().json();
          const errorMsg = errorJson?.error || '';
          if (errorMsg.includes('Firebase ID token') || errorMsg.includes('토큰')) {
            console.warn('🚨 TOKEN_EXPIRED 감지');
            throw new Error('TOKEN_EXPIRED');
          }
        } catch (err) {
          if ((err as Error).message !== 'TOKEN_EXPIRED') {
            console.warn('❌ JSON 파싱 자체가 실패함:', err);
          }
          throw err;
        }
      } else {
        console.warn('❌ 401인데 JSON 아님. Content-Type:', contentType);
      }
    }

    return res;
  };

  try {
    const token = await getValidToken();
    return await doFetch(token);
  } catch (err) {
    if ((err as Error).message === 'TOKEN_EXPIRED') {
      console.log('🔁 토큰 만료 → Firebase에서 재발급 후 재요청');
      const newToken = await getValidToken(true);
      return await doFetch(newToken);
    }

    throw err;
  }
}
