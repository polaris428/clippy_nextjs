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

import { PostCreateUser } from '@/application/usecases/auth/PostCreateUser';
import { PostCreateFolderUsecase } from '@/application/usecases/folder/PostCreateFolderUsecase';
import logger from '@/lib/logger/logger';

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
    let userId = user?.id;
    if (!user) {
      const newUser = container.resolve(PostCreateUser);
      const user = await newUser.execute(decoded);
      userId = user?.id;
      const newFolder = container.resolve(PostCreateFolderUsecase);
      await newFolder.execute({ name: user.name + '개인 폴더', isTemp: false, ownerId: user.name, isInvite: false, isShared: false });
    }

    const getAllFolderUsecase = container.resolve(GetAllFolderUsecase);
    const { folders, sharedFolders } = await getAllFolderUsecase.execute(userId!);

    const response = NextResponse.json({ user, folders, sharedFolders });
    setAuthCookie(response, token);

    logger.info({ userId: user?.id, folders: folders.length, shared: sharedFolders.length }, '✅ 로그인 성공');
    return response;
  } catch (err) {
    logger.error({ err }, '❌ Login failed');
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
