import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { GetFolderIdUsecase } from '@/application/usecases/folder/GetFolderIdUsecase';
import { PostDeleteFolderUsecase } from '@/application/usecases/folder/PostDeleteFolderUsecase';
import { GetAllFolderUsecase } from '@/application/usecases/folder/GetAllFolderUsecase';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);

    const folderId = (await params).id;

    const getFolderIdUsecase = container.resolve(GetFolderIdUsecase);
    await getFolderIdUsecase.execute({ userId: user.id, folderId: folderId });

    const deleteFolderUsecase = container.resolve(PostDeleteFolderUsecase);
    await deleteFolderUsecase.execute(user.id, folderId);

    const getAllFolderUsecase = container.resolve(GetAllFolderUsecase);
    const allFolder = await getAllFolderUsecase.execute(user.id);

    const res = NextResponse.json({
      success: true,
      folders: allFolder,
    });
    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    if (err instanceof Response) {
      return err;
    }
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
