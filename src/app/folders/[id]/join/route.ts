import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GenerateInviteCode } from '@/application/usecases/folder/GenerateInviteCode';
import { getCurrentUserId } from '@/lib/utils/getCurrentUserId';

interface Params {
  params: {
    id: string; // 폴더 ID
  };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const folderId = params.id;

    const usecase = container.resolve(GenerateInviteCode);
    const inviteCode = await usecase.execute(folderId, userId);

    return NextResponse.json({ inviteCode });
  } catch (err) {
    console.error('❌ 초대 코드 생성 실패:', err);
    return NextResponse.json({ error: '초대 코드 생성 실패' }, { status: 403 });
  }
}
