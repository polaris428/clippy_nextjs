// src/lib/cookies.ts
'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7일

export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  console.log('쿠키', (await cookies()).get(COOKIE_NAME)?.value);
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
