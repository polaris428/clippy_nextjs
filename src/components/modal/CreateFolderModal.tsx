'use client';

import { useState } from 'react';
import DefaultButton from '../design-system/Button/DefaultButton/DefaultButton';
import { useCreateFolder } from '@/hooks/folder/useCreateFolder';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateFolderModal({ isOpen, onClose }: Props) {
    const [newFolderName, setNewFolderName] = useState('');
    const [isShared, setIsShared] = useState(false);
    const { createFolder } = useCreateFolder();

    const handleCreateFolder = async () => {
        const name = newFolderName.trim();
        if (!name) {
            alert('폴더 이름을 입력하세요.');
            return;
        }

        setNewFolderName('');
        setIsShared(false);
        onClose();

        try {
            await createFolder(name, isShared);
        } catch {
            alert('폴더 생성 실패');
        }
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white p-6 rounded shadow-lg w-[320px]">
                <h3 className="text-lg font-semibold mb-4">📁 폴더 만들기</h3>
                <input
                    type="text"
                    className="border p-2 w-full mb-2 rounded"
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
                    <DefaultButton label="취소" onClick={onClose} />
                    <DefaultButton label="생성" onClick={handleCreateFolder} />
                </div>
            </div>
        </div>
    );
}
