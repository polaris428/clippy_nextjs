import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderUsecase';
import '@/infrastructure/di/container';

import { container } from 'tsyringe';

import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import logger from '@/lib/logger/logger';

export async function GET(req: NextRequest) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const allFolder = container.resolve(GetAllFolderUsecase);

    const { folders, sharedFolders } = await allFolder.execute(user.id);

    const res = NextResponse.json({ user, folders, sharedFolders });
    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    logger.error({ err }, '❌ 예기치 못한 에러:');
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
