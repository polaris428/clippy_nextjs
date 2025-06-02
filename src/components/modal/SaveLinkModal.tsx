'use client';

import { useState } from 'react';
import DefaultButton from '../design-system/Button/DefaultButton/DefaultButton';
import { Folder } from '@/types/folder/folder'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, url: string, folderId: string) => void;
    folders: Folder[];
}

export default function SaveLinkModal({ isOpen, onClose, onSubmit, folders }: Props) {
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState('');

    const handleSubmit = () => {
        if (!linkTitle.trim() || !linkUrl.trim() || !selectedFolderId) {
            alert('모든 값을 입력하세요.');
            return;
        }
        onSubmit(linkTitle.trim(), linkUrl.trim(), selectedFolderId);
        setLinkTitle('');
        setLinkUrl('');
        setSelectedFolderId('');
        onClose();
    };

    if (!isOpen) return null;
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={handleBackdropClick}>
            <div className="bg-white p-6 rounded shadow-lg w-[320px]">
                <h3 className="text-lg font-semibold mb-4">🔗 링크 저장</h3>
                <input
                    type="text"
                    className="border p-2 w-full mb-2 rounded"
                    placeholder="링크 제목"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                />
                <input
                    type="text"
                    className="border p-2 w-full mb-2 rounded"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                />
                <select
                    className="border p-2 w-full mb-4 rounded"
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
                    <DefaultButton label="취소" onClick={onClose} />
                    <DefaultButton label="저장" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}
