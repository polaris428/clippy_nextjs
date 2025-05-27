import { Switch } from '@/components/design-system';
import { useFolderShareToggle } from '@/hooks/folder/useShareFolder';
import { DefaultButton } from '@/components/design-system';

export function PublishTabContent({ folderId, initialShared, initiaShareKey }: { folderId: string; initialShared: boolean, initiaShareKey: string }) {
    const { isShared, toggleShare, shareKey } = useFolderShareToggle({ folderId, initialShared, initiaShareKey });

    return (
        <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-2">
                <p>웹 게시</p>
                <Switch checked={isShared} onChange={toggleShare} />
            </div>
            <div>
                {isShared && (
                    <div className="border rounded p-1 flex justify-between items-center">
                        <p className="truncate max-w-full">{shareKey}</p>
                        <DefaultButton onClick={() => { navigator.clipboard.writeText(shareKey) }} label="복사" />
                    </div>
                )}
            </div>


        </div>
    );
}
