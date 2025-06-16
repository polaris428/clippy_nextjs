import 'reflect-metadata';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import { NextRequest, NextResponse } from 'next/server';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { mergeCookies } from '@/lib/utils/mergeCookies';

import { HttpError } from '@/lib/errors/HttpError';
import { GetFolderSharesUsecase } from '@/application/usecases/shateFolder/GetFolderSharesUsecase';
import logger from '@/lib/logger/logger';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const folderId = params.id;

    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);

    const usecase = container.resolve(GetFolderSharesUsecase);
    const shares = await usecase.execute({ folderId, userId: user.id });

    const res = NextResponse.json(shares);
    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    logger.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
