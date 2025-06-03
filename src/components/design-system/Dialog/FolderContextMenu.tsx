'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface FolderContextMenuProps {
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    onRequestDelete?: () => void;
}

export default function FolderContextMenu({
    onClose,
    anchorRef,
    onRequestDelete, // ✅ 받기
}: FolderContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [isReady, setIsReady] = useState(false);

    // 위치 계산
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
            className="bg-white border rounded-md shadow-lg py-1 w-48 pointer-events-auto"
            style={{
                top: coords.top,
                left: coords.left,
                position: 'absolute',
            }}
        >
            <div
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                onClick={() => console.log('공유하기')}
            >
                공유하기
            </div>
            <div
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
            >
                이름 바꾸기
            </div>
            <div
                data-testid="delete-button"
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
