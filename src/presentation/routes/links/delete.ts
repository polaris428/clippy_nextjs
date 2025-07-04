import { container } from 'tsyringe';
import { DeleteLinkUsecase } from '@/application/usecases/link/DeleteLinkUsecase';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import logger from '@/lib/logger/logger';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const linkId = id;
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);

    const deleteLink = container.resolve(DeleteLinkUsecase);
    await deleteLink.execute(linkId, user.id);
    const res = NextResponse.json({ success: true });
    if (tempRes) mergeCookies(tempRes, res);
    return res;
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    logger.error({ err }, '❌ 링크 삭제 실패');
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
