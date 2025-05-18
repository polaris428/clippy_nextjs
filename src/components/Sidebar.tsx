'use client';

import { useEffect, useState } from 'react';
import { DefaultButton } from '@/components/design-system';

interface Folder {
    id: string;
    name: string;
}

interface SidebarProps {
    initialFolders: Folder[];
}

export default function Sidebar({ initialFolders }: SidebarProps) {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isShared, setIsShared] = useState(false);
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState('');


    useEffect(() => {
        fetch('/api/folders', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => setFolders(data.folders || []))
            .catch((err) => console.error('폴더 로딩 실패:', err));
    }, []);


    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return alert('폴더 이름을 입력하세요.');

        try {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: newFolderName.trim(),
                    isShared,
                }),
            });

            if (!res.ok) return alert('폴더 생성 실패');

            const newFolder = await res.json();
            setFolders((prev) => [...prev, newFolder]);
            setIsModalOpen(false);
            setNewFolderName('');
            setIsShared(false);
        } catch (err) {
            console.error('🔥 폴더 생성 중 오류:', err);
            alert('오류 발생');
        }
    };

    const handleSaveLink = async () => {
        if (!linkTitle.trim() || !linkUrl.trim() || !selectedFolderId)
            return alert('모든 값을 입력하세요.');

        try {
            const res = await fetch(`/api/folders/${selectedFolderId}/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: linkTitle,
                    url: linkUrl,
                }),
            });

            if (!res.ok) return alert('링크 저장 실패');

            setIsLinkModalOpen(false);
            setLinkTitle('');
            setLinkUrl('');
            setSelectedFolderId('');
        } catch (err) {
            console.error('🔥 링크 저장 오류:', err);
            alert('링크 저장 실패');
        }
    };

    return (
        <div className="p-4">
            <h2 className="font-bold mb-2">📁 내 폴더</h2>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.id} className="mb-1">
                        <DefaultButton as="link" href={`/folders/${folder.id}`} buttonText={folder.name} />
                    </li>
                ))}
            </ul>

            <div className="mt-6 space-y-2">
                <DefaultButton buttonText="➕ 폴더 추가" onClick={() => setIsModalOpen(true)} />
                <DefaultButton buttonText="🔗 링크 저장" onClick={() => setIsLinkModalOpen(true)} />
            </div>

            {/* ✅ 폴더 추가 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[300px]">
                        <h3 className="text-lg font-semibold mb-4">폴더 만들기</h3>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            placeholder="폴더 이름"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <label className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={isShared}
                                onChange={(e) => setIsShared(e.target.checked)}
                                className="mr-2"
                            />
                            공유 폴더
                        </label>
                        <div className="flex justify-end space-x-2">
                            <DefaultButton buttonText="취소" onClick={() => setIsModalOpen(false)} />
                            <DefaultButton buttonText="생성" onClick={handleCreateFolder} />
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ 링크 저장 모달 */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[320px]">
                        <h3 className="text-lg font-semibold mb-4">🔗 링크 저장</h3>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            placeholder="링크 제목"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                        />
                        <select
                            className="border p-2 w-full mb-4"
                            value={selectedFolderId}
                            onChange={(e) => setSelectedFolderId(e.target.value)}
                        >
                            <option value="">폴더 선택</option>
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <DefaultButton buttonText="취소" onClick={() => setIsLinkModalOpen(false)} />
                            <DefaultButton buttonText="저장" onClick={handleSaveLink} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
