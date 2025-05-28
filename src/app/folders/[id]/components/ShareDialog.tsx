'use client';

import { useState } from 'react';
import DialogFrame from '@/components/design-system/dialogs/DialogFrame';
import { ShareTabContent } from './ShareTabContent';
import { PublishTabContent } from './PublishTabContent';
import { DefaultButton } from '@/components/design-system';
import { Folder } from './../../../../types/folder/folder';

interface ShareDialogProps {
    folder: Folder;
}
export default function ShareDialog({ folder }: ShareDialogProps) {
    const [tab, setTab] = useState<'share' | 'publish'>('share');

    return (
        <DialogFrame
            header={
                <div>
                    <div className="flex border-b ">
                        <div className={`  text-sm font-medium ${tab === 'share' ? 'border-b-2 border-black' : 'text-gray-400'}`}>
                            <DefaultButton

                                onClick={() => setTab('share')}
                                label="초대">

                            </DefaultButton>
                        </div>
                        <div className={` text-sm font-medium ${tab === 'publish' ? 'border-b-2 border-black' : 'text-gray-400'}`}>
                            <DefaultButton
                                onClick={() => setTab('publish')}
                                label="게시">

                            </DefaultButton>
                        </div>

                    </div>

                </div>}
            footer={<h1>푸터입니다</h1>}>




            {tab === 'share' && <ShareTabContent folderId={folder.id} initialInvite={folder.isInvite} initiaInviteKey={folder.inviteCode || ""} />}
            {tab === 'publish' && <PublishTabContent folderId={folder.id} initialShared={folder.isShared} initiaShareKey={folder.shareKey || ""} />}
        </DialogFrame>
    );
}
