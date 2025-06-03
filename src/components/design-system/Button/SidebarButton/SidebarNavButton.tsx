'use client';

import Link from 'next/link';
import { ReactNode, useRef, useState } from 'react';
import clsx from 'clsx';
import { DotsThree } from 'phosphor-react';
import FolderContextMenu from '@/components/design-system/Dialog/FolderContextMenu';
import { useMenuStore } from '@/stores/useMenuStore';

interface SidebarNavButtonProps {
    href: string;
    icon: ReactNode;
    label: string;
    selected?: boolean;
    folderId: string;
    onRequestDelete?: () => void;
}

export default function SidebarNavButton({
    href,
    icon,
    label,
    selected,
    folderId,
    onRequestDelete,
}: SidebarNavButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const menuOpenFolderId = useMenuStore((s) => s.menuOpenFolderId);
    const setMenuOpenFolderId = useMenuStore((s) => s.setMenuOpenFolderId);

    const isMenuOpen = menuOpenFolderId === folderId;

    const baseClass = clsx(
        'w-full flex items-center justify-between px-3 py-1 rounded-md text-sm font-medium transition group relative',
        selected ? 'bg-gray-200 text-black' : 'text-gray-700 hover:bg-gray-100'
    );

    return (
        <div
            className={baseClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={href}
                className="flex-1 truncate flex items-center gap-1 my-1"
            >
                {icon && <span className="text-base">{icon}</span>}
                <span className="truncate">{label}</span>
            </Link>

            <button
                ref={menuButtonRef}
                onClick={() => {
                    setMenuOpenFolderId(isMenuOpen ? null : folderId);
                }}
                className={clsx(
                    'p-1 rounded transition',
                    isHovered ? 'block' : 'hidden',
                    'group-hover:block'
                )}
            >
                <DotsThree size={18} />
            </button>

            {isMenuOpen && (
                <FolderContextMenu
                    onClose={() => setMenuOpenFolderId(null)}
                    anchorRef={menuButtonRef}
                    onRequestDelete={() => {
                        setIsHovered(false);
                        onRequestDelete?.();
                    }}
                />
            )}
        </div>
    );
}
