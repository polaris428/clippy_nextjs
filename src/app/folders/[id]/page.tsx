'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import LinkList from '@/components/LinkList';
import { useParams } from 'next/navigation'
export default function FolderPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter();
    const linkId = (params.id)
    const user = useAuthStore((s) => s.user);
    const folders = useAuthStore((s) => s.folders);
    const folder = folders.find((f) => f.id === linkId);

    useEffect(() => {


        const fetchFolders = async () => {
            const res = await fetch(`/api/folders/${linkId}`, { credentials: 'include' });
            if (!res.ok) {
                router.replace('/');
                return;
            }
            const data = await res.json();
            useAuthStore.getState().setFolders(data.folders); // ✅ 전역 상태 갱신
        };

        // 폴더가 없으면 새로 가져오기
        if (!folder) {
            fetchFolders();
        }
    }, [user, folder, linkId, router]);

    if (!folder) return

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>
            {folder.links?.length ? (
                <LinkList links={folder.links} />
            ) : (
                <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
            )}
        </div>
    );
}
