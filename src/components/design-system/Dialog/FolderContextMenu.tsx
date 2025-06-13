'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface FolderContextMenuProps {
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    folderId: string; // 🔥 폴더 ID가 필요
    onRequestDelete?: () => void;
    onRequestRename?: () => void;
}

export default function FolderContextMenu({
    onClose,
    anchorRef,
    folderId,
    onRequestDelete,
    onRequestRename,
}: FolderContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    // 메뉴 위치 계산
    useEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (rect) {
            setCoords({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
            setIsReady(true);
        }
    }, [anchorRef]);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !anchorRef.current?.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose, anchorRef]);

    if (!isReady) return null;

    return createPortal(
        <div
            ref={menuRef}
            className="absolute z-50 bg-white border rounded-md shadow-lg py-1 w-48"
            style={{
                top: coords.top,
                left: coords.left,
                position: 'absolute',
            }}
        >
            <div
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                onClick={() => {
                    onClose();
                    onRequestRename?.();
                }}
            >
                이름 바꾸기
            </div>

            <div
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                onClick={() => {
                    onClose();
                    router.push(`/folders/${folderId}/edit`);
                }}
            >
                폴더 편집
            </div>

            <div
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 text-sm cursor-pointer"
                onClick={() => {
                    onClose();
                    onRequestDelete?.();
                }}
            >
                삭제
            </div>
        </div>,
        document.body
    );
}
