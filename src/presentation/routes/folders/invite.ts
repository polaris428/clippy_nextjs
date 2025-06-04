import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GenerateInviteCodeUsecase } from '@/application/usecases/folder/join/GenerateInviteCodeUsecase';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const folderId = (await params).id;
    const user = await getCurrentUserOrThrow();
    const body = await req.json();

    const usecase = container.resolve(GenerateInviteCodeUsecase);
    const inviteCode = await usecase.execute(folderId, body.isInvite, user.id);
    return NextResponse.json({
      success: true,
      inviteCode,
    });
  } catch (err) {
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
