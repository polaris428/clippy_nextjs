import { Switch } from '@/components/design-system';
import { useFolderIsInviteToggle } from '@/hooks/folder/useFolderIsInviteToggle';
import { DefaultButton } from '@/components/design-system';
export function ShareTabContent({ folderId, initialInvite, initiaInviteKey }: { folderId: string; initialInvite: boolean, initiaInviteKey: string }) {
    const { isShared, toggleShare, shareKey } = useFolderIsInviteToggle({ folderId, initialInvite, initiaInviteKey });
    const shareKeyText = `${window.location.origin}/shared/${shareKey}`

    return (
        <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-2">
                <p>웹 게시</p>
                <Switch checked={isShared} onChange={toggleShare} />
            </div>
            <div>
                {isShared && (
                    <div className="border rounded p-1 flex justify-between items-center">
                        <p className="truncate max-w-full">{shareKeyText}</p>
                        <DefaultButton onClick={() => { navigator.clipboard.writeText(shareKeyText) }} label="복사" />
                    </div>
                )}
            </div>


        </div>
    );
}
