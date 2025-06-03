'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';


interface SidebarNavButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;

}

export default function SidebarNavButton({
    icon,
    label,
    onClick,

}: SidebarNavButtonProps) {
    const baseClass = clsx(
        'w-full flex items-center justify-between  px-3 py-1 rounded-md text-sm font-medium transition group relative text-gray-700 hover:bg-gray-100'
    );

    return (
        <div className={baseClass} >
            <div
                role="button"
                onClick={onClick}
                className="flex-1 truncate flex items-center gap-1 my-1"
            >
                {icon && <span className="text-base">{icon}</span>}
                <span className="truncate">{label}</span>
            </div>
        </div>
    );
}
