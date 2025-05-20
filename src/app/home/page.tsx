'use client';

import { useEffect } from 'react';
import { useLinkStore } from '@/stores/useLinkStore';
import LinkList from '@/components/LinkList';

export default function HomePage() {
    const setLinks = useLinkStore((state) => state.setLinks);

    useEffect(() => {
        fetch('/api/links/all', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => setLinks(data.links)) // ✅ zustand에 저장
            .catch((err) => console.error('링크 로드 실패:', err));
    }, [setLinks]);
    const links = useLinkStore((state) => state.links);
    console.log(links)
    return <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📁 {"전체 폴더"}</h1>

        {links.length > 0 ? (
            <LinkList links={links} />
        ) : (
            <p className="text-gray-500">이 폴더에는 아직 링크가 없습니다.</p>
        )}
    </div>
}
