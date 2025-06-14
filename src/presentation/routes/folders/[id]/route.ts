import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GetFolderIdUsecase } from '@/application/usecases/folder/GetFolderIdUsecase';
import { PostDeleteFolderUsecase } from '@/application/usecases/folder/PostDeleteFolderUsecase';
import { PostUpdateFolderUsecase } from '@/application/usecases/folder/PostUpdateFolderUsecase';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import logger from '@/lib/logger/logger';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const usecase = container.resolve(GetFolderIdUsecase);
    const { folder } = await usecase.execute({ userId: user.id, folderId: params.id });
    const res = NextResponse.json({ folder });
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const usecase = container.resolve(PostUpdateFolderUsecase);
    const data = await req.json();
    const folder = await usecase.execute({ userId: user.id, folderId: params.id, data });
    const res = NextResponse.json({ folder });
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const usecase = container.resolve(PostDeleteFolderUsecase);
    const result = await usecase.execute(user.id, params.id);
    const res = NextResponse.json(result);
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
