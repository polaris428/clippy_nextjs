/* eslint-disable @next/next/no-img-element */
'use client';


import { Link } from '@/types/links/link';
import { format } from 'date-fns';
import { useDeleteLink } from '@/hooks/link/useDeleteLink';
import { useUpdateLink } from '@/hooks/link/useUpdateLink';
import { PushPinSimple, PushPinSimpleSlash } from 'phosphor-react';
export default function LinkList({ links, readOnly = false }: { links: Link[]; readOnly?: boolean }) {

    const { deleteLink } = useDeleteLink();
    const { updateLink } = useUpdateLink();

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
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
                    <li key={link.id} className="w-full group">
                        <section className="relative rounded-lg overflow-hidden shadow-sm cursor-pointer w-full h-[12rem]">
                            <img
                                src={thumbnail}
                                alt="썸네일"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/ic_logo.png';
                                }}
                            />

                            {/* 오른쪽 상단 버튼들 */}
                            {!readOnly && (
                                <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">

                                    <div
                                        title={link.isPin ? '북마크 해제' : '북마크 고정'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateLink(link.id, { isPin: !link.isPin });
                                        }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow bg-white hover:bg-gray-200 ${link.isPin ? ' text-red-400' : ' text-gray-400 '}`}
                                    >
                                        {link.isPin ? (
                                            <PushPinSimple weight="fill" size={16} />
                                        ) : (
                                            <PushPinSimpleSlash weight="duotone" size={16} />
                                        )}
                                    </div>

                                    <div
                                        title="편집"
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-gray-700 text-sm hover:bg-gray-100"
                                    >
                                        ✏️
                                    </div>
                                    <div
                                        title="삭제"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteLink(link);

                                        }}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-gray-700 text-sm hover:bg-gray-100"
                                    >
                                        🗑️
                                    </div>
                                </div>
                            )}

                            {/* 우측 하단 파비콘 */}
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

                        <header className="pt-4">
                            <div className="text-base font-semibold text-gray-900 truncate">
                                {link.title || domain}
                            </div>
                            <p className="text-sm text-gray-500 leading-[1.25rem] line-clamp-2 min-h-[2.5rem]">
                                {description}
                            </p>
                        </header>

                        <footer>
                            <div className="flex justify-between mt-3 text-xs text-gray-400">
                                <span>{domain}</span>
                                <span>{createdAt}</span>
                            </div>
                        </footer>
                    </li>
                );
            })}
        </ul>
    );
}
