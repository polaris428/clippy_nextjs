import { NextResponse } from 'next/server';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderUsecase';
import '@/infrastructure/di/container';
import { setAuthCookie } from '@/lib/utils/cookies';
import { container } from 'tsyringe';
import { getAuthCookie } from '@/lib/utils/cookies';

export async function GET() {
  const token = await getAuthCookie();

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const login = container.resolve(LoginUseCase);
    const allFolder = container.resolve(GetAllFolderUsecase);
    const user = await login.execute(token);
    const { folders, sharedFolders } = await allFolder.execute(user.id);

    const response = NextResponse.json({ user, folders, sharedFolders });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error('❌ Login failed:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
