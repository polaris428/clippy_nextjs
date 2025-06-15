'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Folder } from '@/types/folder/folder';
import { ShareLinkBox } from '@/components/ShareLinkBox';

export default function AddFolderPage() {
    const [name, setName] = useState('');
    const [isShared, setIsShared] = useState(false);
    const [isInvite, setIsInvite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createdFolder, setCreatedFolder] = useState<Folder | null>(null);

    const hasCreatedRef = useRef(false);
    const isTempRef = useRef(true);
    const createdFolderRef = useRef<Folder | null>(null);

    const addFolder = useAuthStore(s => s.addFolder);
    const router = useRouter();

    useEffect(() => {
        if (hasCreatedRef.current) return;
        hasCreatedRef.current = true;

        const createTempFolder = async () => {
            try {
                const { newFolder } = await FolderService.createFolder('새 폴더', false);
                setCreatedFolder(newFolder);
                setName(newFolder.name);
                setIsShared(newFolder.isShared);
                setIsInvite(newFolder.isInvite);
                isTempRef.current = true;
                createdFolderRef.current = newFolder;
            } catch {
                alert('임시 폴더 생성에 실패했습니다.');
                router.back();
            }
        };

        createTempFolder();
    },);

    useEffect(() => {
        const handleBeforeUnload = () => {
            const folder = createdFolderRef.current;
            if (folder?.id && isTempRef.current) {
                FolderService.deleteFolder(folder.id);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleSubmit = async () => {
        if (!createdFolder || !name.trim()) return;
        setIsLoading(true);
        try {
            const updated = await FolderService.updateFolder(createdFolder.id, {
                name: name.trim(),
                isShared,
                isInvite,
                isTemp: false,
            });

            setCreatedFolder(updated);
            createdFolderRef.current = updated;
            isTempRef.current = false;
            addFolder(updated);
            router.push(`/folders/${updated.id}`);
        } catch {
            alert('폴더 저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const shareLink = createdFolder ? `${window.location.origin}/shared/${createdFolder.id}` : '';
    const inviteLink = createdFolder ? `${window.location.origin}/invite/${createdFolder.id}` : '';

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 space-y-8">


            {createdFolder && (

                <>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        📁 <span>새 폴더 만들기</span>
                    </h1>

                    <div className="rounded-2xl border shadow-sm p-6 space-y-4">
                        <label className="block text-sm font-medium">폴더 이름</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="폴더 이름을 입력하세요"
                            className="rounded-xl px-4 h-11"
                            disabled={isLoading || !createdFolder}
                        />
                    </div>
                    <div className="rounded-2xl border shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">🔗 웹 게시</p>
                                <p className="text-sm text-muted-foreground">링크가 있는 모든 사용자가 볼 수 있습니다</p>
                            </div>
                            <Switch checked={isShared} onCheckedChange={setIsShared} disabled={isLoading} />
                        </div>
                        {isShared && (
                            <ShareLinkBox
                                title="공유 링크"
                                description="복사하려면 클릭하세요"
                                url={shareLink}
                            />
                        )}
                    </div>

                    <div className="rounded-2xl border shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">📨 초대</p>
                                <p className="text-sm text-muted-foreground">초대받은 사용자만 접근할 수 있습니다</p>
                            </div>
                            <Switch checked={isInvite} onCheckedChange={setIsInvite} disabled={isLoading} />
                        </div>
                        {isInvite && (
                            <ShareLinkBox
                                title="초대 링크"
                                description="복사하려면 클릭하세요"
                                url={inviteLink}
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>취소</Button>
                        <Button onClick={handleSubmit} disabled={isLoading || !createdFolder}>
                            {isLoading ? '저장 중...' : '폴더 만들기'}
                        </Button>
                    </div>
                </>
            )}


        </div>
    );
}