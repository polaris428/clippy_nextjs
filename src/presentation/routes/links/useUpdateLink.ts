import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { UpdateLinkUsecase } from '@/application/usecases/link/UpdateLinkUsecase';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { HttpError } from '@/lib/errors/HttpError';
import logger from '@/lib/logger/logger';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const linkId = (await params).id;
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);

    const body = await req.json();

    const updateLink = container.resolve(UpdateLinkUsecase);
    const updatedLink = await updateLink.execute(linkId, user.id, {
      title: body.title,
      description: body.description,
      isPin: body.isPin,
    });
    const res = NextResponse.json({ success: true, link: updatedLink }, { status: 200 });
    if (tempRes) mergeCookies(tempRes, res);
    return res;
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    logger.error('❌ 링크 수정 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
