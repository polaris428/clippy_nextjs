import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

type FolderPageProps = {
    params: {
        id: string;
    };
};

export async function generateMetadata({ params }: FolderPageProps): Promise<Metadata> {
    const { id } = await params
    const folder = await prisma.folder.findUnique({
        where: { id: id },
    });

    if (!folder) {
        return {
            title: "폴더를 찾을 수 없음",
        };
    }

    return {
        title: `📁 ${folder.name}`,
    };
}
export default async function FolderPage({ params }: FolderPageProps) {
    const { id } = await params

    const folder = await prisma.folder.findUnique({
        where: { id },
        include: { links: true },
    });

    if (!folder) return notFound();

    return (
        <div>
            <h1>📁 {folder.name}</h1>
            {/* 링크 목록 등 추가 */}
        </div>
    );
}