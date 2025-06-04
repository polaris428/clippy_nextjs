import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GenerateInviteCodeUsecase } from '@/application/usecases/folder/join/GenerateInviteCodeUsecase';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getVerifiedUser();
    const userId = await getCurrentUserId();
    const folderId = (await params).id;
    const body = await req.json();

    const usecase = container.resolve(GenerateInviteCodeUsecase);
    const inviteCode = await usecase.execute(folderId, body.isInvite, userId);

    return NextResponse.json({ inviteCode });
  } catch (err) {
    console.error('❌ 초대 코드 생성 실패:', err);
    return NextResponse.json({ error: '초대 코드 생성 실패' }, { status: 403 });
  }
}
