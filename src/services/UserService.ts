import { LoginResponse } from '@/types/auth/loginResponse';
export const UserService = {
  async postLogIn(token: string): Promise<LoginResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) throw new Error('로그인 실패');
    return (await res.json()) as LoginResponse;
  },
};
