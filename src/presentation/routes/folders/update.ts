import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FolderUpdateInput } from '@/types/folder/FolderUpdateInput';
import { getCurrentUserOrThrow } from '@/lib/utils/getCurrentUserOrThrow';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const folderId = params.id;
    const user = await getCurrentUserOrThrow();

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.ownerId !== user.id) {
      return NextResponse.json({ error: '권한 없음' }, { status: 403 });
    }

    const body = await req.json();

    // 🔐 허용된 필드만 업데이트: 화이트리스트 방식
    const allowedFields = ['name', 'isShared'];
    const updateData: Partial<FolderUpdateInput> = {};

    for (const key of allowedFields) {
      if (key in body) {
        updateData[key as keyof FolderUpdateInput] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: '업데이트할 필드가 없습니다.' }, { status: 400 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: updateData,
    });
    console.log(updatedFolder);
    return NextResponse.json({
      success: true,
      folders: await prisma.folder.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'asc' },
      }),
    });
  } catch (err) {
    if (err instanceof Response) {
      return err; // status 포함 응답 그대로 반환
    }
    console.error('❌ 예기치 못한 에러:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
