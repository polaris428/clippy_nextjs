/* eslint-disable @next/next/no-img-element */
'use client';

import { Link } from '@prisma/client';

export default function LinkList({ links }: { links: Link[] }) {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {links.map((link) => {
                const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                const domain = (() => {
                    try {
                        const url = new URL(href);
                        return url.hostname.replace('www.', '');
                    } catch {
                        return link.url;
                    }
                })();

                const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                const thumbnail = link.thumbnail || '/default-thumbnail.png';
                const description = link.description || '설명 없음';
                const safeThumbnail = link.thumbnail && link.thumbnail.startsWith('http')
                    ? link.thumbnail
                    : '/img/ic_logo.png';
                return (
                    <li
                        key={link.id}
                        onClick={() => window.open(href, '_blank')}
                        className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col"
                    >
                        {/* 썸네일 */}
                        <div className="w-full h-40 mb-3 overflow-hidden rounded">
                            <img
                                loading="lazy"
                                src={safeThumbnail}
                                key={thumbnail}
                                alt="사이트 썸네일"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/ic_logo.png';
                                }}
                            />
                        </div>

                        {/* 제목 + 파비콘 */}
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={favicon}
                                alt="favicon"
                                className="w-5 h-5"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/ic_logo.png';
                                }}
                            />
                            <span className="text-base font-medium text-gray-800 truncate">
                                {link.title || domain}
                            </span>
                        </div>

                        {/* 설명 */}
                        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
                    </li>
                );
            })}
        </ul>
    );
}
