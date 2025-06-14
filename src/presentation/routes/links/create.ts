import 'reflect-metadata';
import '@/infrastructure/di/container';
import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';
import { container } from 'tsyringe';
import { HttpError } from '@/lib/errors/HttpError';
import { tryParseAuthHeaderAndSetCookie } from '@/lib/utils/authFromHeader';
import { mergeCookies } from '@/lib/utils/mergeCookies';
import { CreateLinkUsecase } from '@/application/usecases/link/CreateLinkUsecase';

export async function POST(req: NextRequest) {
  try {
    const tempRes = await tryParseAuthHeaderAndSetCookie(req);
    const user = await getCurrentUserOrThrow(req);
    const body = await req.json();
    const { folderId, url, title, description } = body;

    const usecase = container.resolve(CreateLinkUsecase);

    const newLink = await usecase.execute({ url: url, title: title, description: description, folderId: folderId, userId: user.id });

    const res = NextResponse.json(
      {
        success: true,
        message: '링크가 성공적으로 생성되었습니다.',
        link: newLink,
      },
      { status: 201 }
    );
    if (tempRes) mergeCookies(tempRes, res);

    return res;
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
