import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';
import { container } from 'tsyringe';
import { JoinFolderByInviteCodeUsecase } from '@/application/usecases/folder/join/JoinFolderByInviteCodeUsecase';

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { inviteCode } = await req.json();

    const usecase = container.resolve(JoinFolderByInviteCodeUsecase);
    await usecase.execute(userId, inviteCode);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ 초대 실패:', err);
    return NextResponse.json({ error: '초대 실패' }, { status: 400 });
  }
}
