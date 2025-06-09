'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSaveLinkForm } from '@/hooks/link/useSaveLinkForm';
import { useAuthStore } from '@/stores/useAuthStore';
import { LinkForm } from '@/components/LinkForm';

export default function SaveLinkPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    const {
        url, title, description, image,
        folderId, isLoading, isFetchingMeta, isMetadataFetched,
        setUrl, setTitle, setDescription, setFolderId,
        handleSubmit,
    } = useSaveLinkForm();

    useEffect(() => {
        if (!user) router.push('/ko');
    }, [user, router]);

    if (!user) return null;

    return (
        <LinkForm
            mode="create"
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
    );
}
