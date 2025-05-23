'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SidebarNavButtonProps {
    href?: string;                // 링크 이동 경로 (있으면 Link, 없으면 버튼)
    icon?: ReactNode;             // 아이콘 컴포넌트 (Phosphor 등)
    label: string;                // 버튼 텍스트
    onClick?: () => void;         // 클릭 이벤트
    isActive?: boolean;           // 선택 상태
    selected?: boolean;           // 선택 상태 (isActive 대체)
}

export default function SidebarNavButton({
    href,
    icon,
    label,
    onClick,
    isActive,
    selected,
}: SidebarNavButtonProps) {
    const baseClass = clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
        (isActive || selected)
            ? 'bg-gray-200 text-black'
            : 'text-gray-700 hover:bg-gray-100'
    );

    const content = (
        <>
            {icon && <span className="text-base">{icon}</span>}
            <span className="truncate">{label}</span>
        </>
    );

    return href ? (
        <Link href={href} className={baseClass}>
            {content}
        </Link>
    ) : (
        <div role="button" onClick={onClick} className={baseClass}>
            {content}
        </div>
    );
}
