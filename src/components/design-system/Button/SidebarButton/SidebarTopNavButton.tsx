'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SidebarNavTopButtonProps {
    href: string;
    icon: ReactNode;
    label: string;
    selected?: boolean;


}

export default function SidebarTopNavButton({
    href,
    icon,
    label,
    selected,


}: SidebarNavTopButtonProps) {


    const baseClass = clsx(
        'w-full flex items-center justify-between px-3 py-1 rounded-md text-sm font-medium transition group relative',
        selected ? 'bg-gray-200 text-black' : 'text-gray-700 hover:bg-gray-100'
    );

    return (
        <div
            className={baseClass}

        >
            <Link
                href={href}
                className="flex-1 truncate flex items-center gap-1 my-1"
            >
                {icon && <span className="text-base">{icon}</span>}
                <span className="truncate">{label}</span>
            </Link>





        </div>
    );
}
