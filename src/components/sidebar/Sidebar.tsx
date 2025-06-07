'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNavButton } from '@/components/design-system';
import { SidebarButton } from '@/components/design-system';
import { DeleteFolderDialog, RenameFolderDialog } from '@/components/design-system';
import CreateFolderModal from '../modal/CreateFolderModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';
import {
    Folders,
    PlusCircle,
    LinkSimple,
    PushPinSimple
} from 'phosphor-react';

import SidebarTopNavButton from '../design-system/Button/SidebarButton/SidebarTopNavButton';

import { useNavigate } from '@/lib/utils/navigation';
export default function Sidebar() {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const folders = useAuthStore((s) => s.folders) ?? [];

    const setFolders = useAuthStore((s) => s.setFolders);
    const sharedFolders = useAuthStore((s) => s.sharedFolders);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
    const [mode, setMode] = useState<'delete' | 'rename' | null>(null);
    const targetFolder = folders.find((f) => f.id === targetFolderId) ?? null;

    const navigate = useNavigate();
    const handleDeleteConfirm = async () => {
        console.log("성공", targetFolderId)
        if (!targetFolderId) return;

        try {
            const res = await FolderService.deleteFolder(targetFolderId);
            const { deletedFolder, isShared } = res;
            console.log("성공", deletedFolder)
            if (deletedFolder) {


                const store = useAuthStore.getState();
                console.log("성공", deletedFolder)
                console.log("성공", isShared)
                if (isShared) {
                    store.removeSharedFolder(deletedFolder.id);
                } else {
                    store.removeFolder(deletedFolder.id);
                }

                if (targetFolderId === currentFolderId) {
                    const fallbackFolder = store.folders[0] || store.sharedFolders[0];
                    navigate(fallbackFolder ? `/folders/${encodeURIComponent(fallbackFolder.id)}` : '/no-folders');
                }
            }
        } catch (err) {
            console.error('폴더 삭제 중 오류 발생:', err);
        }

        setTargetFolderId(null);
        setMode(null);
    };

    const handleRenameConfirm = async (newName: string) => {
        if (!targetFolder) return;

        const folder = await FolderService.updateFolder(targetFolder.id, { name: newName });
        if (folder) {
            setFolders(folders);
        }

        setTargetFolderId(null);
        setMode(null);
    };

    return (
        <div className="h-full flex flex-col justify-between p-6 bg-white">
            <div className="flex flex-col flex-1 min-h-0">
                <div className="mb-4 space-y-1"></div>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ul className="space-y-1">
                        <div className="mb-4 space-y-1">
                            <SidebarTopNavButton
                                href="/folders/all"
                                icon={<LinkSimple size={18} />}
                                label="모든 클립"
                                selected={pathname === '/folders/all'}
                            />

                            <SidebarTopNavButton
                                href="/folders/pin"
                                icon={<PushPinSimple size={18} />}
                                label="고정됨"
                                selected={pathname === '/folders/pin'}
                            />
                            <hr className="my-2" />

                        </div>


                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <SidebarNavButton
                                    icon={<Folders size={18} />}
                                    label={folder.name}
                                    href={`/folders/${folder.id}`}
                                    selected={folder.id === currentFolderId}
                                    folderId={folder.id}
                                    onRequestDelete={() => {
                                        setTargetFolderId(folder.id);
                                        setMode('delete');
                                    }}
                                    onRequestRename={() => {
                                        setTargetFolderId(folder.id);
                                        setMode('rename');
                                    }}
                                />
                            </li>
                        ))}

                        {sharedFolders.map((folder) => (

                            <li key={folder.id}>

                                <SidebarNavButton
                                    icon={<Folders size={18} />}
                                    label={folder.isShared ? `${folder.name} 🔗` : folder.name}
                                    href={`/folders/${folder.id}`}
                                    selected={folder.id === currentFolderId}
                                    folderId={folder.id}
                                    onRequestDelete={
                                        folder.isShared ? undefined : () => {
                                            setTargetFolderId(folder.id);
                                            setMode('delete');
                                        }
                                    }
                                    onRequestRename={
                                        folder.isShared ? undefined : () => {
                                            setTargetFolderId(folder.id);
                                            setMode('rename');
                                        }
                                    }
                                />
                            </li>))}

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
                    onClick={() => navigate('/addFolder')}
                />
            </div>

            <CreateFolderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <DeleteFolderDialog
                open={mode === 'delete'}
                onClose={() => {
                    setTargetFolderId(null);
                    setMode(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
            <RenameFolderDialog
                initialName={targetFolder?.name ?? ''}
                open={mode === 'rename'}
                onClose={() => {
                    setTargetFolderId(null);
                    setMode(null);
                }}
                onConfirm={handleRenameConfirm}
            />
        </div >
    );
}
