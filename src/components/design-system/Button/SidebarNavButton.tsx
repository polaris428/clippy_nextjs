'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SidebarNavButtonProps {
    href?: string;                    // 링크 이동
    icon?: ReactNode;                 // 아이콘
    label: string;                    // 라벨 텍스트
    isActive?: boolean;              // 선택 여부
    onClick?: () => void;            // 클릭 이벤트
    selected?: boolean;              // 선택 여부 대체 필드 (선택)
}

export default function SidebarNavButton({
    href,
    icon,
    label,
    isActive,
    onClick,
    selected,
}: SidebarNavButtonProps) {
    const baseClass = clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition',
        (isActive || selected) ? 'bg-gray-200 font-medium text-black' : 'text-gray-700'
    );

    const content = (
        <>
            <span className="text-base">{icon}</span>
            {label}
        </>
    );

    // href가 있으면 Link로, 없으면 div 버튼으로 렌더링
    return href ? (
        <Link href={href} className={baseClass}>
            {content}
        </Link>
    ) : (
        <button onClick={onClick} className={baseClass}>
            {content}
        </button>
    );
}
