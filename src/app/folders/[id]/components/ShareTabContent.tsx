'use client';

import { Switch } from '@/components/design-system';
import { useFolderIsInviteToggle } from '@/hooks/folder/useFolderIsInviteToggle';
import { DefaultButton } from '@/components/design-system';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function ShareTabContent() {
    const pathname = usePathname();
    const currentFolderId = pathname.split('/folders/')[1]?.split('/')[0];

    const folder = useAuthStore((state) =>
        state.folders.find((f) => f.id === currentFolderId)
    );

    const { isIsInvite, toggleShare, inviteCode } = useFolderIsInviteToggle({
        folderId: folder?.id || '',
        initialInvite: folder?.isInvite ?? false,
        initiaInviteKey: folder?.inviteCode ?? '',
    });

    const shareKeyText = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inviteCode}`;

    if (!folder) return null;

    return (
        <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-2">
                <p>웹 게시</p>
                <Switch checked={isIsInvite} onChange={toggleShare} />
            </div>
            {isIsInvite && (
                <div className="border rounded p-1 flex justify-between items-center">
                    <p className="truncate max-w-full">{shareKeyText}</p>
                    <DefaultButton onClick={() => navigator.clipboard.writeText(shareKeyText)} label="복사" />
                </div>
            )}
        </div>
    );
}
