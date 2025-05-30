import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GenerateInviteCode } from '@/application/usecases/folder/GenerateInviteCode';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await getVerifiedUser();
    const userId = await getCurrentUserId();

    const folderId = params.id;

    const usecase = container.resolve(GenerateInviteCode);
    const inviteCode = await usecase.execute(folderId, true, userId);

    return NextResponse.json({ inviteCode });
  } catch (err) {
    console.error('❌ 초대 코드 생성 실패:', err);
    return NextResponse.json({ error: '초대 코드 생성 실패' }, { status: 403 });
  }
}
