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
  const rawAuth = (await headerStore).get('authorization');
  const token = rawAuth?.replace('Bearer ', '');

  logger.info({ rawAuth, token: token?.slice(0, 20) + '...' }, '🔍 받은 Authorization 헤더');

  if (!token) {
    logger.warn('❗️토큰 누락: 클라이언트에서 Authorization 헤더가 전달되지 않았습니다.');
    throw new UnauthorizedError('인증 토큰이 없습니다.');
  }

  let decoded;
  try {
    decoded = await verifyIdToken(token);
    logger.info(
      {
        uid: decoded.uid,
        email: decoded.email,
        exp: decoded.exp,
        now: Math.floor(Date.now() / 1000),
        iat: decoded.iat,
      },
      '✅ Firebase 토큰 디코딩 성공'
    );
  } catch (err) {
    logger.error({ err, token }, '🔥 Firebase verifyIdToken 실패 - 아마도 만료된 토큰');
    throw new UnauthorizedError('Firebase ID token has expired. Get a fresh ID token from your client app and try again');
  }

  try {
    logger.info('🚀 LoginUseCase 실행 시작');
    const login = container.resolve(LoginUseCase);
    const user = await login.execute(decoded);
    let userId = user?.id;

    if (user) {
      logger.info({ userId, email: user.email }, '👤 기존 사용자 로그인');
    } else {
      logger.info('🆕 신규 사용자로 판단됨 → 사용자 생성 시작');
      const newUser = container.resolve(PostCreateUser);
      const createdUser = await newUser.execute(decoded);
      userId = createdUser?.id;
      logger.info({ userId, email: createdUser.email }, '✅ 사용자 생성 완료');

      logger.info('📁 개인 폴더 생성 시작');
      const newFolder = container.resolve(PostCreateFolderUsecase);
      await newFolder.execute({
        name: createdUser.name + '개인 폴더',
        isTemp: false,
        ownerId: createdUser.id,
        isInvite: false,
        isShared: false,
      });
      logger.info('✅ 개인 폴더 생성 완료');
    }

    logger.info('📂 사용자 폴더 조회 시작');
    const getAllFolderUsecase = container.resolve(GetAllFolderUsecase);
    const { folders, sharedFolders } = await getAllFolderUsecase.execute(userId!);

    const response = NextResponse.json({ user, folders, sharedFolders });
    setAuthCookie(response, token);

    logger.info({ userId, folders: folders.length, sharedFolders: sharedFolders.length }, '✅ 로그인 및 폴더 정보 반환 성공');

    return response;
  } catch (err) {
    logger.error({ err }, '❌ Login 처리 중 서버 내부 오류');
    return NextResponse.json({ error: 'Login failed', message: (err as Error)?.message }, { status: 500 });
  }
}
