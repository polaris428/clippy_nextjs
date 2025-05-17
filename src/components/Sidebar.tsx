'use client';

import { useEffect, useState } from 'react';
import { DefaultButton } from "@/components/design-system";
import { useRouter } from "next/navigation";
interface Folder {
    id: string;
    name: string;
}

export default function Sidebar() {
    const router = useRouter();
    const [folders, setFolders] = useState<Folder[]>([]);
    const handleAddFolder = () => {
        router.push("/folders/new"); // 또는 모달 열기
    };
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
