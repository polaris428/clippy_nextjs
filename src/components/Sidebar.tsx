'use client';

import { useEffect, useState } from 'react';
import { DefaultButton } from "@/components/design-system";


interface Folder {
    id: string;
    name: string;
    isShared?: boolean;
}

export default function Sidebar() {

    const [folders, setFolders] = useState<Folder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isShared, setIsShared] = useState(false);

    const handleAddFolder = () => {
        setIsModalOpen(true);
    };
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return alert('폴더 이름을 입력하세요.');

        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('로그인이 필요합니다.');

            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
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

            // 초기화 및 닫기
            setIsModalOpen(false);
            setNewFolderName('');
            setIsShared(false);
        } catch (err) {
            console.error('🔥 폴더 생성 중 오류:', err);
            alert('오류 발생');
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem('folders');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setFolders(parsed);
            } catch (e) {
                console.error('폴더 파싱 실패:', e);
            }
        }
    }, []);

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
                <DefaultButton buttonText="➕ 폴더 추가" onClick={handleAddFolder} />
            </div>

            {/* ✅ 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded p-6 w-[90%] max-w-sm shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">📂 새 폴더 만들기</h3>

                        <input
                            type="text"
                            placeholder="폴더 이름"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-full border p-2 mb-4 rounded"
                        />

                        <label className="flex items-center space-x-2 mb-4">
                            <input
                                type="checkbox"
                                checked={isShared}
                                onChange={(e) => setIsShared(e.target.checked)}
                            />
                            <span>공유 폴더로 만들기</span>
                        </label>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
