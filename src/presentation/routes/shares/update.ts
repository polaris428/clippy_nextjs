import 'reflect-metadata';
import '@/infrastructure/di/container';
import { container } from 'tsyringe';
import { NextRequest, NextResponse } from 'next/server';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { HttpError } from '@/lib/errors/HttpError';

import { FolderPermission } from '@prisma/client';
import { UpdateCollaboratorPermissionUsecase } from '@/application/usecases/shateFolder/UpdateCollaboratorPermissionUsecase';
import logger from '@/lib/logger/logger';

export async function PATCH(req: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const folderId = params.id;
    const targetUserId = params.userId;

    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const currentUser = await getCurrentUserOrThrow(req);

    const { permission } = await req.json();

    if (!['READ', 'WRITE'].includes(permission)) {
      return NextResponse.json({ success: false, error: 'Invalid permission' }, { status: 400 });
    }

    const usecase = container.resolve(UpdateCollaboratorPermissionUsecase);

    await usecase.execute({
      folderId,
      userId: targetUserId,
      permission: permission as FolderPermission,
      currentUserId: currentUser.id,
    });

    const res = NextResponse.json({ success: true });

    if (tempRes) mergeCookies(tempRes, res);
    return res;
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.statusCode });
    }

    logger.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
  }
}
