'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Folder {
    id: string;
    name: string;
}

export default function Sidebar() {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('folders');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setFolders(parsed);
            } catch (e) {
                console.error('폴더 파싱 실패:', e);
            }
        }
    }, []);

    return (
        <div className="p-4">
            <h2 className="font-bold mb-2">📁 내 폴더</h2>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.id} className="mb-1">
                        <Link href={`/folders/${folder.id}`} className="text-blue-600 hover:underline">
                            {folder.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
