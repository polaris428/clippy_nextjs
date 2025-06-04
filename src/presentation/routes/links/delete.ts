import { container } from 'tsyringe';
import { DeleteLinkUsecase } from '@/application/usecases/link/DeleteLinkUsecase';
import { NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const linkId = (await params).id;

  try {
    const user = await getCurrentUserOrThrow();

    const deleteLink = container.resolve(DeleteLinkUsecase);
    await deleteLink.execute(linkId, user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error('❌ 링크 삭제 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
