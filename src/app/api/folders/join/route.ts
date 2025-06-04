import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { JoinFolderUsecase } from '@/application/usecases/folder/join/JoinFolderUsecase';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';

export async function POST(req: NextRequest) {
  try {
    const { inviteCode } = await req.json();
    await getVerifiedUser();
    const userId = await getCurrentUserId();

    const usecase = container.resolve(JoinFolderUsecase);
    const { folderId } = await usecase.execute({ inviteCode, userId });

    return NextResponse.json({ success: true, folderId });
  } catch (err) {
    console.error('❌ 폴더 참가 실패:', err);
    return NextResponse.json({ error: '폴더 참가 실패' }, { status: 400 });
  }
}
