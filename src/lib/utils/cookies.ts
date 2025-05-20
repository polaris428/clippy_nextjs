// src/lib/cookies.ts
'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7일
export async function setAuthCookie(response: NextResponse, token: string) {
  console.log('쿠키 저장 시도');

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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
