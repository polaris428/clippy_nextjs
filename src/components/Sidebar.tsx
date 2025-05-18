'use client';

import { useEffect, useState } from 'react';
import { DefaultButton } from '@/components/design-system';


interface Folder {
    id: string;
    name: string;
}

export default function Sidebar() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isShared, setIsShared] = useState(false);

    // ✅ 폴더 불러오기
    useEffect(() => {
        fetch('/api/folders', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFolders(data.folders || []))
            .catch(err => console.error('폴더 로딩 실패:', err));
    }, []);

    // ✅ 폴더 생성
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return alert('폴더 이름을 입력하세요.');

        try {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: newFolderName.trim(),
                    isShared,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error('폴더 생성 실패:', err);
                return alert('폴더 생성 실패');
            }

            const newFolder = await res.json();
            setFolders(prev => [...prev, newFolder]);

            // 초기화
            setIsModalOpen(false);
            setNewFolderName('');
            setIsShared(false);
        } catch (err) {
            console.error('🔥 폴더 생성 중 오류:', err);
            alert('오류 발생');
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
            <div className="mt-6">
                <DefaultButton buttonText="➕ 폴더 추가" onClick={() => setIsModalOpen(true)} />
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
        </div>
    );
}
