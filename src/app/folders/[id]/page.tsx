import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

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
            <h1 className="text-2xl font-bold mb-4">📁 {folder.name}</h1>

            {folder.links.length > 0 ? (
                <ul className="space-y-2">
                    {folder.links.map((link) => (
                        <li key={link.id} className="p-3 border rounded">
                            <a
                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {link.title || link.url}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
            )}
        </div>
    );
}
