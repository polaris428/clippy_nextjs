'use client';

import Link from 'next/link';
import { ReactNode, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { DotsThree } from 'phosphor-react';
import FolderContextMenu from '../../Dialogs/FolderContextMenu'; // 경로 확인 필요

interface SidebarNavButtonProps {
    href: string;
    icon: ReactNode;
    label: string;
    selected?: boolean;
}

export default function SidebarNavButton({
    href,
    icon,
    label,
    selected,
}: SidebarNavButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const baseClass = clsx(
        'w-full flex items-center justify-between  px-3 py-1 rounded-md text-sm font-medium transition group relative',
        (selected)
            ? 'bg-gray-200 text-black'
            : 'text-gray-700 hover:bg-gray-100'
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!menuButtonRef.current?.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const wrapperProps = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return (
        <div className={baseClass} {...wrapperProps}>

            <Link href={href} className="flex-1 truncate flex items-center gap-1 my-1">
                {icon && <span className="text-base">{icon}</span>}
                <span className="truncate">{label}</span>
            </Link>

            <button
                ref={menuButtonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen((prev) => !prev);
                }}
                onMouseDown={(e) => e.preventDefault()}
                className={clsx(
                    'p-1 rounded  transition',
                    isHovered ? 'block' : 'hidden',
                    'group-hover:block'
                )}
            >
                <DotsThree size={18} />
            </button>

            {isMenuOpen && (
                <FolderContextMenu
                    onClose={() => setIsMenuOpen(false)}
                    anchorRef={menuButtonRef}
                />
            )}
        </div>
    );
}
