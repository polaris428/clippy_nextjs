'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FolderService } from '@/services/FolderService';
import { Folder } from '@/types/folder/folder';
import { ShareLinkBox } from '@/components/ShareLinkBox';
import { FolderShareManager } from '@/components/FolderShareManager';

export default function FolderEditPage() {
    const params = useParams();
    const folderId = params?.id as string;
    const [folder, setFolder] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!folderId) return;
        const fetch = async () => {
            try {
                const data = await FolderService.getFolderById(folderId);

                console.log("성공", data.folder.isInvite)
                setFolder(data.folder);
            } catch (e) {
                console.log(e)
                alert('폴더 정보를 불러오지 못했습니다');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [folderId]);
    useEffect(() => {
        if (folder) {
            console.log('✅ folder.isInvite 상태:', folder.isInvite);
        }
    }, [folder]);
    if (loading) return <div className="p-6">불러오는 중...</div>;
    if (!folder) return <div className="p-6 text-red-500">폴더가 존재하지 않습니다.</div>;

    const inviteLink = `${window.location.origin}/invite/${folder.id}`;
    console.log(Boolean(folder.isInvite))
    return (
        <div className="max-w-2xl mx-auto py-12 px-6 space-y-8">
            <h1 className="text-2xl font-semibold">📁 폴더 공유 설정</h1>

            {Boolean(folder.isInvite) ? (
                <FolderShareManager
                    folderId={folder.id}
                    inviteLink={inviteLink}
                    isInvite={folder.isInvite}
                />
            ) : (
                <p className="text-sm text-muted-foreground">이 폴더는 현재 초대 기능이 비활성화되어 있습니다.</p>
            )}

            {folder.isShared && (
                <div className="mt-6">
                    <ShareLinkBox
                        title="웹 게시 링크"
                        description="공개된 폴더입니다."
                        url={`${window.location.origin}/shared/${folder.id}`}
                    />
                </div>
            )}
        </div>
    );
}