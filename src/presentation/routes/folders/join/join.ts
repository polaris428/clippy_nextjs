import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { JoinFolderUsecase } from '@/application/usecases/folder/join/JoinFolderUsecase';
import logger from '@/lib/logger/logger';

export async function POST(req: NextRequest) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const { inviteCode } = await req.json();

    const usecase = container.resolve(JoinFolderUsecase);
    const { folderId } = await usecase.execute({ inviteCode: inviteCode, userId: user.id });

    const res = NextResponse.json({
      success: true,
      folderId: folderId,
    });
    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    logger.error('❌ 폴더 참가 실패:', err);
    return NextResponse.json({ error: '폴더 참가 실패' }, { status: 400 });
  }
}
