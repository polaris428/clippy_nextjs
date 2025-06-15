import { auth } from '@/lib/firebase/client';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import logger from '../logger/logger';

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
      logger.warn('401 Unauthorized 응답 수신 - 토큰 만료 추정');
      throw new Error('TOKEN_EXPIRED');
    }

    return res;
  };

  try {
    const token = await getValidToken();
    return await doFetch(token);
  } catch (err) {
    if ((err as Error).message === 'TOKEN_EXPIRED') {
      const newToken = await getValidToken(true);
      return await doFetch(newToken);
    }

    throw err;
  }
}
