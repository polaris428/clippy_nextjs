'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNavButton } from '@/components/design-system';
import { SidebarButton } from '@/components/design-system';
import { DeleteFolderDialog, RenameFolderDialog } from '@/components/design-system';
import CreateFolderModal from '../modal/CreateFolderModal';
import SaveLinkModal from '../modal/SaveLinkModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { FolderService } from '@/services/FolderService';
import {
    Folders,
    PlusCircle,
    LinkSimple,
} from 'phosphor-react';
import { useCreateLink } from '@/hooks/user/useCreateLink';
export default function Sidebar() {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const folders = useAuthStore((s) => s.folders);
    const setFolders = useAuthStore((s) => s.setFolders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
    const [mode, setMode] = useState<'delete' | 'rename' | null>(null);
    const targetFolder = folders.find((f) => f.id === targetFolderId) ?? null;
    const { createLink } = useCreateLink()

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
                onSubmit={(title, url, folderId) =>
                    createLink({ title, url, folderId })
                }
                folders={folders} // ✅ 이거 추가!
            />
            <DeleteFolderDialog
                open={mode === 'delete'}
                onClose={() => {
                    setTargetFolderId(null);
                    setMode(null);
                }}
                onConfirm={async () => {
                    if (targetFolderId != null) {
                        const res = await FolderService.deleteFolder(targetFolderId);
                        if (res?.folders) {
                            setFolders(res.folders);
                        }
                    }
                    setTargetFolderId(null);
                    setMode(null);
                }}
            />
            <RenameFolderDialog
                initialName={targetFolder?.name ?? ''}
                open={mode === 'rename'}
                onClose={() => {
                    setTargetFolderId(null);
                    setMode(null);
                }}
                onConfirm={async (newName) => {
                    if (targetFolder) {
                        const res = await FolderService.updateFolder(targetFolder.id, { name: newName });
                        if (res?.folders) {
                            setFolders(res.folders);
                        }
                        setTargetFolderId(null);
                        setMode(null);
                    }
                }}
            />
        </div>
    );
}
