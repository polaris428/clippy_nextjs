/* eslint-disable @next/next/no-img-element */
'use client';

import { Link } from '@prisma/client';
import { format } from 'date-fns';

export default function LinkList({ links }: { links: Link[] }) {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
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
                const thumbnail = link.thumbnail || '/img/ic_logo.png';
                const description = link.description || '설명 없음';
                const createdAt = format(new Date(link.createdAt), 'yyyy.MM.dd');

                return (
                    <li key={link.id} className="w-full">
                        <section className="relative rounded-lg overflow-hidden shadow-sm cursor-pointer w-full">
                            <img
                                src={thumbnail}
                                alt="썸네일"
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/ic_logo.png';
                                }}
                            />
                            <div className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                                <img
                                    src={favicon}
                                    alt="favicon"
                                    className="w-6 h-6"
                                    onError={(e) => {
                                        e.currentTarget.src = '/img/ic_logo.png';
                                    }}
                                />
                            </div>
                        </section>

                        <div className=" pt-4">
                            <div className="text-base font-semibold text-gray-900 truncate">
                                {link.title || domain}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-snug max-h-[3rem]">
                                {description}
                            </p>

                            <div className="flex justify-between mt-3 text-xs text-gray-400">
                                <span>{domain}</span>
                                <span>{createdAt}</span>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
