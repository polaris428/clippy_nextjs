import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';
import LinkList from '@/components/LinkList';
interface FolderPageProps {
    params: {
        id: string;
    };
}

// ✅ 메타데이터 설정
export async function generateMetadata(
    { params }: FolderPageProps
): Promise<Metadata> {
    const id = (await params).id
    const folder = await prisma.folder.findUnique({
        where: { id: id },
        select: { name: true },
    });

    if (!folder) {
        return { title: '폴더를 찾을 수 없음' };
    }

    return { title: `📁 ${folder.name}` };
}

// ✅ 폴더 상세 페이지
export default async function FolderPage({ params }: FolderPageProps) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    const id = (await params).id
    if (!token) return redirect('/');

    const decoded = await verifyIdToken(token);
    const firebaseUid = decoded.uid;

    const user = await prisma.user.findUnique({
        where: { firebaseUid },
    });

    if (!user) return redirect('/');

    const folder = await prisma.folder.findUnique({
        where: { id },
        include: {
            links: {
                orderBy: {
                    createdAt: 'desc', // 최신순 정렬
                },
            },
        },
    });

    if (!folder || folder.ownerId !== user.id) {
        return redirect('/');
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>

            {folder.links.length > 0 ? (
                <LinkList links={folder.links} />
            ) : (
                <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
            )}
        </div>
    );

}

