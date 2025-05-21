import { container } from 'tsyringe';
import { DeleteLink } from '@/application/usecases/link/DeleteLink';
import { getAuthCookie } from '@/lib/utils/cookies';
import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = getAuthCookie();
  const id = (await params).id;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const userId = await getCurrentUserId();

    const deleteLink = container.resolve(DeleteLink);
    await deleteLink.execute(id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ 링크 삭제 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
