'use client';

import { useState } from 'react';
import SidebarButton from '../design-system/Button/SidebarNavButton';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, isShared: boolean) => void;
}

export default function CreateFolderModal({ isOpen, onClose, onSubmit }: Props) {
    const [newFolderName, setNewFolderName] = useState('');
    const [isShared, setIsShared] = useState(false);

    const handleSubmit = () => {
        if (!newFolderName.trim()) {
            alert('폴더 이름을 입력하세요.');
            return;
        }
        onSubmit(newFolderName.trim(), isShared);
        setNewFolderName('');
        setIsShared(false);
        onClose();
    };

    if (!isOpen) return null;
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={handleBackdropClick}>
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
                    <SidebarButton label="취소" onClick={onClose} />
                    <SidebarButton label="생성" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
} 
