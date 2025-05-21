import { container } from 'tsyringe';
import { CreateLink } from '@/application/usecases/link/CreateLink';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    const { url, folderId } = await req.json();

    const createLink = container.resolve(CreateLink);
    await createLink.execute({ url, folderId, userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('링크 생성 실패:', err);
    return NextResponse.json({ error: '토큰 만료 또는 인증 실패' }, { status: 401 });
  }
}
