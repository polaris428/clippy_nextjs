import 'reflect-metadata';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import { GetLinkByIdUseCase } from '@/application/usecases/link/GetLinkByIdUseCase';
import { NextResponse } from 'next/server';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const linkId = params.id;
  console.log('아아아ㅏ디디디', linkId);
  try {
    const user = await getCurrentUserOrThrow();
    const getLinkByIdUseCase = container.resolve(GetLinkByIdUseCase);
    const link = await getLinkByIdUseCase.execute(linkId, user.id);

    return NextResponse.json({ success: true, link });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error('❌ 링크 조회 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
  }
}
