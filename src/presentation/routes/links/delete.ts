import { container } from 'tsyringe';
import { DeleteLinkUsecase } from '@/application/usecases/link/DeleteLinkUsecase';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const linkId = (await params).id;
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
    console.error('❌ 링크 삭제 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
