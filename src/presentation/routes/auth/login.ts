'use server';

import 'reflect-metadata';
import { headers } from 'next/headers';
import { container } from 'tsyringe';
import { NextResponse } from 'next/server';

import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderUsecase';

import '@/infrastructure/di/container';
import { setAuthCookie } from '@/lib/utils/cookies';
import { verifyIdToken } from '@/lib/firebase';
import { UnauthorizedError } from '@/lib/errors/UnauthorizedError';

export async function POST() {
  const headerStore = headers();
  const token = (await headerStore).get('authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError('인증 토큰이 없습니다.');
  }

  let decoded;
  try {
    decoded = await verifyIdToken(token);
  } catch {
    throw new UnauthorizedError('Firebase ID token has expired. Get a fresh ID token from your client app and try again');
  }

  try {
    const login = container.resolve(LoginUseCase);
    const user = await login.execute(decoded);

    const getAllFolderUsecase = container.resolve(GetAllFolderUsecase);
    const { folders, sharedFolders } = await getAllFolderUsecase.execute(user.id);

    const response = NextResponse.json({ user, folders, sharedFolders });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error('❌ Login failed:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
