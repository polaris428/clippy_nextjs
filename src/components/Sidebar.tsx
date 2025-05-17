'use client';

import { useEffect, useState } from 'react';
import { DefaultButton } from '@/components/design-system';
import { useRouter } from 'next/navigation';

interface Folder {
    id: string;
    name: string;
}

export default function Sidebar() {
    const router = useRouter();
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        fetch('/api/folders', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFolders(data.folders || []))
            .catch(err => console.error('폴더 로딩 실패:', err));
    }, []);

    const handleAddFolder = () => {
        router.push('/folders/new'); // 임시 라우팅, 이후 다이얼로그로 개선 가능
    };

    return (
        <div className="p-4">
            <h2 className="font-bold mb-2">📁 내 폴더</h2>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.id} className="mb-1">
                        <DefaultButton as="link" href={`/folders/${folder.id}`} buttonText={folder.name} />
                    </li>
                ))}
            </ul>
            <div className="mt-6">
                <DefaultButton buttonText="➕ 폴더 추가" onClick={handleAddFolder} />
            </div>
        </div>
    );
}
