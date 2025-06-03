'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface DialogFrameProps {

    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    className?: string;
    width?: string;
}

export default function DialogFrame({
    header,
    children,
    footer,
    className,
    width = 'w-[460px]',
}: DialogFrameProps) {
    return (
        <div className=" w-full h-full flex justify-center items-start">
            <div className={clsx('bg-white border border-gray-300 rounded-lg', width, className)}>
                <div>
                    {header && (
                        <div className="border-b border-gray-300 px-4 pt-3">
                            {header}
                        </div>
                    )}
                </div>

                {/* 본문 */}
                <div className="p-3  text-sm">{children}</div>

                <div>
                    {footer && (
                        <div className="border-t border-gray-300 px-4 py-3">
                            {footer}
                        </div>
                    )}
                </div>
                {/* 하단 푸터 */}

            </div>
        </div>
    );
}
