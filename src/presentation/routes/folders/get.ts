import 'reflect-metadata';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { GetFolderIdUsecase } from '@/application/usecases/folder/GetFolderIdUsecase';
import { HttpError } from '@/lib/errors/HttpError';
import logger from '@/lib/logger/logger';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const getFolderIdUsecase = container.resolve(GetFolderIdUsecase);
    const data = await getFolderIdUsecase.execute({ userId: user.id, folderId: id });

    const res = NextResponse.json({
      success: true,
      folder: data.folder,
    });

    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    logger.error({ err }, '❌ 예기치 못한 에러:');
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
