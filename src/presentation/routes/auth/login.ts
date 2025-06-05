'use server';

import 'reflect-metadata';
import { headers } from 'next/headers';
import { container } from 'tsyringe';
import { NextResponse } from 'next/server';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { IFolderRepository } from '@/domain/folder/IFolderRepository';
import '@/infrastructure/di/container';
import { setAuthCookie } from '@/lib/utils/cookies';

export async function POST() {
  const headerStore = headers();
  const token = (await headerStore).get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  //유스케이스 통해서 호출해야함
  try {
    const login = container.resolve(LoginUseCase);
    const user = await login.execute(token);
    const folderRepository = container.resolve<IFolderRepository>('IFolderRepository');
    const folders = await folderRepository.getFoldersByUserId(user.id);
    const sharedFolders = await folderRepository.findShareFoldersByUserId(user.id);
    const response = NextResponse.json({ user, folders, sharedFolders });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error('❌ Login failed:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
