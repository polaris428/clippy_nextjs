'use server';

import 'reflect-metadata';
import { headers } from 'next/headers';
import { container } from 'tsyringe';
import { NextResponse } from 'next/server';
import { LoginWithFirebase } from '@/application/usecases/auth/login';
import { IFolderRepository } from '@/domain/folder/IFolderRepository';
import '@/infrastructure/di/container';
import { setAuthCookie } from '@/lib/utils/cookies';

export async function POST() {
  const headerStore = headers();
  const token = (await headerStore).get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const login = container.resolve(LoginWithFirebase);
    const folderRepository = container.resolve<IFolderRepository>('IFolderRepository');
    const user = await login.execute(token);
    const folders = await folderRepository.findFoldersByUserId(user.id);
    setAuthCookie(token);
    return NextResponse.json({ user, folders });
  } catch (err) {
    console.error('❌ Login failed:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
