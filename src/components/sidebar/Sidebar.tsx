'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarButton from '../design-system/Button/SidebarNavButton';
import CreateFolderModal from '../modal/CreateFolderModal';
import SaveLinkModal from '../modal/SaveLinkModal';
import { Folder } from '@/types/folder/folder'
import {
    BookmarkSimple,
    FolderSimple,
    Users,
    Folders,
    PlusCircle,
    LinkSimple,
} from 'phosphor-react';



interface SidebarProps {
    initialFolders: Folder[];
}

export default function Sidebar({ initialFolders }: SidebarProps) {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/folders', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => setFolders(data.folders || []))
            .catch((err) => console.error('폴더 로딩 실패:', err));
    }, []);

    const handleCreateFolder = async (name: string, isShared: boolean) => {
        try {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, isShared }),
            });
            if (!res.ok) return alert('폴더 생성 실패');
            const newFolder = await res.json();
            setFolders((prev) => [...prev, newFolder]);
        } catch (err) {
            console.error('🔥 폴더 생성 오류:', err);
            alert('오류 발생');
        }
    };

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
                <div className="mb-4 space-y-1">
                    <SidebarButton
                        icon={<BookmarkSimple size={18} />}
                        label="모든 클립"
                        href="/home"
                        selected={pathname === '/home'}
                    />
                    <SidebarButton
                        icon={<FolderSimple size={18} />}
                        label="미분류 클립"
                        href="/uncategorized"
                        selected={pathname === '/uncategorized'}
                    />
                    <SidebarButton
                        icon={<Users size={18} />}
                        label="공유받은 폴더"
                        href="/shared"
                        selected={pathname === '/shared'}
                    />
                </div>

                <hr className="my-2" />

                <div className="flex-1 overflow-y-auto min-h-0">
                    <ul className="space-y-1">
                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <SidebarButton
                                    icon={<Folders size={18} />}
                                    label={folder.name}
                                    href={`/folders/${folder.id}`}
                                    selected={folder.id === currentFolderId}
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
                onSubmit={handleCreateFolder}
            />

            <SaveLinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSubmit={handleSaveLink}
                folders={folders}
            />
        </div>
    );
}