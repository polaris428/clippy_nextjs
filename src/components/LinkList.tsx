'use client';

import { Link } from '@prisma/client';

export default function LinkList({ links }: { links: Link[] }) {
    return (
        <ul className="flex flex-col gap-3">
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

                return (
                    <li
                        key={link.id}
                        onClick={() => window.open(href, '_blank')}
                        className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="text-lg font-semibold text-gray-800 truncate">
                                {link.title || link.url}
                            </div>
                            <div className="text-sm text-gray-500 truncate">{domain}</div>

                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
