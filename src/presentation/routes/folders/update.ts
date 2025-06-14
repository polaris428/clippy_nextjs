import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { GetFolderIdUsecase } from '@/application/usecases/folder/GetFolderIdUsecase';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { PatchUpdateFolderUsecase } from '@/application/usecases/folder/PatchUpdateFolderUsecase';
import { FolderUpdateDto, FolderUpdateDtoKeys } from '@/types/dto/folder/FolderUpdateDto';
import logger from '@/lib/logger/logger';
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);

    const folderId = params.id;

    const getFolderIdUsecase = container.resolve(GetFolderIdUsecase);
    await getFolderIdUsecase.execute({ userId: user.id, folderId: folderId });

    const body = await req.json();

    const allowedFields = FolderUpdateDtoKeys;
    const updateData: Partial<FolderUpdateDto> = {};

    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: '업데이트할 필드가 없습니다.' }, { status: 400 });
    }
    const patchUpdateFolderUsecase = container.resolve(PatchUpdateFolderUsecase);
    const updatedFolder = await patchUpdateFolderUsecase.execute({ folderId: folderId, data: updateData });
    const res = NextResponse.json({
      success: true,
      folder: updatedFolder,
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
