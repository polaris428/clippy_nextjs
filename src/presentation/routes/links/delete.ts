import { container } from 'tsyringe';
import { DeleteLink } from '@/application/usecases/link/DeleteLink';
import { getAuthCookie } from '@/lib/utils/cookies';
import { NextResponse } from 'next/server';
import { getVerifiedUserId } from '@/lib/utils/cookies';
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const token = getAuthCookie();
  console.log('토토토톹 ', token);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const userId = await getVerifiedUserId();
    const deleteLink = container.resolve(DeleteLink);
    await deleteLink.execute(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ 링크 삭제 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
