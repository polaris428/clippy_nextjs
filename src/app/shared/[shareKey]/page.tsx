import prisma from '@/lib/prisma';
import LinkList from '@/app/folders/[id]/components/LinkList';
import { notFound } from 'next/navigation';

export default async function SharedFolderPage({ params }: { params: { shareKey: string } }) {
    const folder = await prisma.folder.findFirst({
        where: {
            shareKey: params.shareKey,
            isShared: true, // 🔐 공유가 켜진 경우만 허용
        },
        include: {
            links: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!folder) return notFound();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>
            <p className="text-sm text-gray-500 mb-4">이 페이지는 공유된 폴더의 미리보기입니다.</p>

            {folder.links.length > 0 ? (
                <LinkList links={folder.links} readOnly={true} /> // ✅ 수정/삭제 비활성화
            ) : (
                <p className="text-gray-400">링크가 없습니다.</p>
            )}
        </div>
    );
}