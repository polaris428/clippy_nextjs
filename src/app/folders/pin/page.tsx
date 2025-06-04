'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

import { DefaultButton } from '@/components/design-system';
import EmptyFolder from '@/components/EmptyFolder';
import LinkList from '@/app/folders/[id]/components/LinkList';

export default function PinnedLinksPage() {
    const folders = useAuthStore((s) => s.folders);
    const sharedFolders = useAuthStore((s) => s.sharedFolders);

    const pinnedLinks = useMemo(() => {
        const ownedLinks = folders.flatMap(folder => folder.links ?? []);
        const sharedLinks = sharedFolders.flatMap(shared => shared.links ?? []);
        return [...ownedLinks, ...sharedLinks].filter(link => link.isPin);
    }, [folders, sharedFolders]);

    return (
        <div className="relative">
            <div className="flex gap-2 mb-4">
                <DefaultButton label="📌 핀한 클립" />
                <DefaultButton label="개인 페이지" />
            </div>

            <h1 className="text-2xl font-bold mb-6">📌 핀한 링크 모음</h1>

            {pinnedLinks.length > 0 ? (
                <LinkList links={pinnedLinks} />
            ) : (
                <EmptyFolder />
            )}
        </div>
    );
}
