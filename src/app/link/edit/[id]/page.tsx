'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEditLinkForm } from '@/hooks/link/useEditLinkForm';
import { LinkForm } from '@/components/LinkForm';
import { LinkService } from '@/services/LinkService';
import type { Link } from '@/types/links/link';
import logger from '@/lib/logger/logger';




export default function EditLinkPage() {
    const params = useParams<{ id: string }>();
    const linkId = params.id;

    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [link, setLink] = useState<Link | null>(null);
    const [error, setError] = useState(false);

    const {
        url,
        title,
        description,
        image,
        folderId,
        isLoading,
        isFetchingMeta,
        isMetadataFetched,
        setUrl,
        setTitle,
        setDescription,
        setFolderId,
        handleSubmit,
    } = useEditLinkForm(link ?? ({} as Link));

    // ✅ fetch 후 초기화 로직을 먼저 실행 가능하도록 위치 조정
    useEffect(() => {
        if (!user || !linkId) {
            router.push('/ko');
            return;
        }

        (async () => {
            try {
                const res = await LinkService.getLinkById(linkId);
                if (!res) {
                    setError(true);
                    return;
                }
                setLink(res);


                setUrl(res.url);
                setTitle(res.title);
                setDescription(res.description || '');
                setFolderId(res.folderId);
            } catch (err) {

                logger.error({ err }, '❌ 링크 조회 중 오류:');
                setError(true);
            }
        })();
    },);

    if (!user) return null;
    if (error) return <div className="text-red-500">링크를 불러올 수 없습니다.</div>;
    if (!link) return <div>로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto py-14 px-8 space-y-8">

            <LinkForm
                mode="edit"
                url={url}
                title={title}
                description={description}
                image={image}
                folderId={folderId}
                isLoading={isLoading}
                isFetchingMeta={isFetchingMeta}
                isMetadataFetched={isMetadataFetched}
                setUrl={setUrl}
                setTitle={setTitle}
                setDescription={setDescription}
                setFolderId={setFolderId}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
