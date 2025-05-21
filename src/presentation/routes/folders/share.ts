'use server';

import { container } from 'tsyringe';
import { UpdateFolderShare } from '@/application/usecases/folder/UpdateFolderShare';
import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId.ts';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getVerifiedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = await getCurrentUserId();
  const folderId = (await params).id;
  try {
    const { isShared } = await req.json();

    const usecase = container.resolve(UpdateFolderShare);
    const { shareKey } = await usecase.execute({ folderId, userId, isShared });

    return NextResponse.json({ shareKey });
  } catch (err) {
    console.error('❌ 공유 설정 실패:', err);
    return NextResponse.json({ error: '공유 설정 실패' }, { status: 500 });
  }
}
