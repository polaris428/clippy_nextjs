import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import logger from '@/lib/logger/logger';

export async function POST(req: NextRequest) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const { name, isShared, isInvite, isTemp = true } = await req.json();

    const newFolder = await prisma.folder.create({
      data: {
        name,
        isShared: !!isShared,
        isInvite: !!isInvite,
        isTemp: isTemp,
        ownerId: user.id,
        inviteCode: randomUUID(),
        shareKey: randomUUID(),
      },
    });
    const res = NextResponse.json({ newFolder });
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
