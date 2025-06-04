import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { UpdateLinkUsecase } from '@/application/usecases/link/UpdateLinkUsecase';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const linkId = (await params).id;

  try {
    const user = await getCurrentUserOrThrow();
    const body = await req.json();

    const updateLink = container.resolve(UpdateLinkUsecase);
    const updatedLink = await updateLink.execute(linkId, user.id, {
      title: body.title,
      description: body.description,
      isPin: body.isPin,
    });

    return NextResponse.json({ success: true, link: updatedLink }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }

    console.error('❌ 링크 수정 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
