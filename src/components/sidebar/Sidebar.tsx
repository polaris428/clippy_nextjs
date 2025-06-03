'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNavButton } from '@/components/design-system';
import { SidebarButton } from '@/components/design-system';
import { DeleteFolderDialog } from '@/components/design-system'
import CreateFolderModal from '../modal/CreateFolderModal';
import SaveLinkModal from '../modal/SaveLinkModal';
import { useAuthStore } from '@/stores/useAuthStore';
import {
    // BookmarkSimple,
    // FolderSimple,
    // Users,
    Folders,
    PlusCircle,
    LinkSimple,
} from 'phosphor-react';

export default function Sidebar() {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const folders = useAuthStore((s) => s.folders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

    const handleSaveLink = async (
        title: string,
        url: string,
        folderId: string
    ) => {
        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, url, folderId }),
            });
            if (!res.ok) return alert('링크 저장 실패');
        } catch (err) {
            console.error('🔥 링크 저장 오류:', err);
            alert('링크 저장 실패');
        }
    };

    return (
        <div className="h-full flex flex-col justify-between p-6 bg-white">
            <div className="flex flex-col flex-1 min-h-0">
                <div className="mb-4 space-y-1"></div>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ul className="space-y-1">
                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <SidebarNavButton
                                    icon={<Folders size={18} />}
                                    label={folder.name}
                                    href={`/folders/${folder.id}`}
                                    selected={folder.id === currentFolderId}
                                    folderId={folder.id}
                                    onRequestDelete={() => setTargetFolderId(folder.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <hr className="my-2" />

            <div className="space-y-2 pt-3">
                <SidebarButton
                    icon={<PlusCircle size={18} />}
                    label="폴더 추가"
                    onClick={() => setIsModalOpen(true)}
                />
                <SidebarButton
                    icon={<LinkSimple size={18} />}
                    label="링크 저장"
                    onClick={() => setIsLinkModalOpen(true)}
                />
            </div>

            <CreateFolderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <SaveLinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSubmit={handleSaveLink}
                folders={folders}
            />
            <DeleteFolderDialog
                folderId={targetFolderId ?? ''}
                open={!!targetFolderId}
                onClose={() => setTargetFolderId(null)}
                onConfirm={async () => {
                    // await deleteFolder(targetFolderId);
                    setTargetFolderId(null);
                }}
            />
        </div>
    );
}