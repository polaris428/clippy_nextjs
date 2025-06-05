'use client';

import { useState } from 'react';
import DialogFrame from '@/components/design-system/Dialog/DialogFrame';
import { ShareTabContent } from './ShareTabContent';
import { PublishTabContent } from './PublishTabContent';
import { DefaultButton } from '@/components/design-system';



export default function ShareDialog() {
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
        >




            {tab === 'share' && <ShareTabContent />}
            {tab === 'publish' && <PublishTabContent />}
        </DialogFrame>
    );
}
