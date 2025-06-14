import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { PostDeleteFolderUsecase } from '@/application/usecases/folder/PostDeleteFolderUsecase';
import logger from '@/lib/logger/logger';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const folderId = params.id;

    const deleteFolderUsecase = container.resolve(PostDeleteFolderUsecase);
    const { deletedFolder, isShared } = await deleteFolderUsecase.execute(user.id, folderId);

    const res = NextResponse.json({
      success: true,
      deletedFolder,
      isShared,
    });

    if (tempRes) mergeCookies(tempRes, res);
    return res;
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    logger.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
