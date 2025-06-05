'use client';

import { Switch } from '@/components/design-system';
import { DefaultButton } from '@/components/design-system';
import { useFolderShareToggle } from '@/hooks/folder/useShareFolder';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function PublishTabContent() {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const folder = useAuthStore((state) =>
        state.folders.find((f) => f.id === currentFolderId)
    );

    const { isShared, toggleShare, shareKey } = useFolderShareToggle({
        folderId: folder?.id || '',
    });
    console.log("폴더 공유 ", folder)
    console.log("폴더 공유 ", folder?.shareKey)
    const shareKeyText = `${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${shareKey}`;

    if (!folder) return null;

    return (
        <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-2">
                <p>웹 게시</p>
                <Switch checked={isShared} onChange={toggleShare} />
            </div>
            {isShared && (
                <div className="border rounded p-1 flex justify-between items-center">
                    <p className="truncate max-w-full">{shareKeyText}</p>
                    <DefaultButton onClick={() => navigator.clipboard.writeText(shareKeyText)} label="복사" />
                </div>
            )}
        </div>
    );
}
