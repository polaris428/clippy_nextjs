import { auth } from '@/lib/firebase/client';

export async function fetchWithFirebaseRetry<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
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
      console.warn(' 401 Unauthorized 응답 수신 - 토큰 만료 추정');
      throw new Error('TOKEN_EXPIRED');
    }

    return res;
  };

  try {
    const token = await getValidToken();
    const res = await doFetch(token);
    return await handleResponse(res);
  } catch (err) {
    if ((err as Error).message === 'TOKEN_EXPIRED') {
      console.log(' 토큰 만료 → Firebase에서 재발급 후 재요청');
      const newToken = await getValidToken(true);
      const res = await doFetch(newToken);
      return await handleResponse(res);
    }

    throw err;
  }

  async function handleResponse(res: Response): Promise<T> {
    let json: any = null;
    try {
      json = await res.json();
    } catch (_) {
      // ignore json parse errors
    }

    if (!res.ok || (json && json.success === false)) {
      const message = json?.error || json?.message || res.statusText;
      throw new Error(message);
    }

    return json as T;
  }
}
