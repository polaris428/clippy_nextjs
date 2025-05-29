'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

import LinkList from './components/LinkList';
import { DefaultButton } from '@/components/design-system';
import ShareDialog from './components/ShareDialog';
import EmptyFolder from '@/components/EmptyFolder'
    ;
export default function FolderPage() {
    const params = useParams<{ id: string }>();
    const folderId = params.id;
    const folders = useAuthStore((s) => s.folders);
    const folder = folders.find((f) => f.id === folderId);

    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareButtonRef = useRef<HTMLDivElement>(null);

    const toggleShareDialog = () => {
        setIsShareOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isShareOpen &&
                shareButtonRef.current &&
                !shareButtonRef.current.contains(event.target as Node)
            ) {
                setIsShareOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShareOpen]);


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
                            <ShareDialog folder={folder} />
                        </div>
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">📁 {folder.name}</h1>



            {folder.links?.length ? (
                <LinkList links={folder.links} />
            ) : (
                <EmptyFolder />
            )}
        </div>
    );
}
