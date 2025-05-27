'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFolderPageActions } from '@/hooks/folder/useFolderPageActions';
import LinkList from './components/LinkList';
import { DefaultButton } from '@/components/design-system';
import ShareDialog from './components/ShareDialog'; // folders/[id]/ 내에 위치

export default function FolderPage() {
    const params = useParams<{ id: string }>();
    const folderId = params.id;
    const router = useRouter();
    const folders = useAuthStore((s) => s.folders);
    const folder = folders.find((f) => f.id === folderId);
    const { fetchFolder, generateInviteCode } = useFolderPageActions(folderId);

    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareButtonRef = useRef<HTMLDivElement>(null);

    const toggleShareDialog = () => {
        setIsShareOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!folder) {
            fetchFolder().catch(() => router.replace('/'));
        }
    }, [folder, fetchFolder, router]);

    if (!folder) return;


    return (
        <div className="relative">
            <div className="flex gap-2 mb-4">
                <DefaultButton label={folder.name} />
                <DefaultButton label="개인 페이지지" />

                {/* 공유 버튼을 감싼 wrapper를 relative로 설정 */}
                <div className="relative" ref={shareButtonRef}>
                    <DefaultButton label="공유하기" onClick={toggleShareDialog} />

                    {/* 다이얼로그는 해당 버튼 아래에 위치하도록 absolute로 설정 */}
                    {isShareOpen && (
                        <div className="absolute left-0 mt-2 z-50">
                            <ShareDialog folderId={folder.id} initialShared={folder.isShared} initiaShareKey={folder.shareKey || ""} />
                        </div>
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>

            <div
                className="inline-block cursor-pointer text-sm bg-green-600 text-white px-4 py-2 rounded mb-4 ml-2"
                onClick={generateInviteCode}
            >
                📨 초대 코드 만들기
            </div>



            {folder.links?.length ? (
                <LinkList links={folder.links} />
            ) : (
                <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
            )}
        </div>
    );
}
