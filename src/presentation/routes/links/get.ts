import 'reflect-metadata';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import { GetLinkByIdUseCase } from '@/application/usecases/link/GetLinkByIdUseCase';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import logger from '@/lib/logger/logger';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id;
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    await getCurrentUserOrThrow(req);
    const getLinkByIdUseCase = container.resolve(GetLinkByIdUseCase);
    const link = await getLinkByIdUseCase.execute(linkId);
    const res = NextResponse.json({ success: true, link });
    if (tempRes) mergeCookies(tempRes, res);
    return res;
  } catch (err) {
    if (err instanceof Response) return err;

    logger.error('❌ 링크 조회 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
  }
}
