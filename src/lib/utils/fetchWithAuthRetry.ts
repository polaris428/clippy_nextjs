import { auth } from '@/lib/firebase/client';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export async function fetchWithFirebaseRetry(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const user = auth.currentUser;
  if (!user) throw new UnauthorizedError();

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
      console.warn('401 Unauthorized 응답 수신 - 토큰 만료 추정');
      throw new Error('TOKEN_EXPIRED');
    }

    return res;
  };

  try {
    const token = await getValidToken();
    return await doFetch(token);
  } catch (err) {
    if ((err as Error).message === 'TOKEN_EXPIRED') {
      console.log(' 토큰 만료 → Firebase에서 재발급 후 재요청');
      const newToken = await getValidToken(true);
      return await doFetch(newToken);
    }

    throw err;
  }
}
