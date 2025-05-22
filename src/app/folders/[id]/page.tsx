'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFolderPageActions } from '@/hooks/folder/useFolderPageActions';
import LinkList from './components/LinkList';

export default function FolderPage() {
    const params = useParams<{ id: string }>();
    const folderId = params.id;
    const router = useRouter();
    //const user = useAuthStore((s) => s.user);
    const folders = useAuthStore((s) => s.folders);
    const folder = folders.find((f) => f.id === folderId);
    const { fetchFolder, generateInviteCode, shareFolder } = useFolderPageActions(folderId);

    useEffect(() => {
        if (!folder) {
            fetchFolder().catch(() => router.replace('/'));
        }
    }, [folder, fetchFolder, router]);

    if (!folder) return;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>

            <div
                className="inline-block cursor-pointer text-sm bg-green-600 text-white px-4 py-2 rounded mb-4 ml-2"
                onClick={generateInviteCode}
            >
                📨 초대 코드 만들기
            </div>

            <div
                className="inline-block cursor-pointer text-sm bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={shareFolder}
            >
                🔗 공유하기
            </div>

            {folder.links?.length ? (
                <LinkList links={folder.links} />
            ) : (
                <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
            )}
        </div>
    );
}
