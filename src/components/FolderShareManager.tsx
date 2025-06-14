'use client';

import { useFolderShares } from '@/hooks/folder/shear/useShareFolder';

import { ShareLinkBox } from '@/components/ShareLinkBox';

interface Props {
    folderId: string;
    inviteLink: string;
    isInvite: boolean;
}

export function FolderShareManager({ folderId, inviteLink, isInvite }: Props) {
    const { users, updatePermission, isLoading } = useFolderShares(folderId, isInvite);

    if (!isInvite) return null;

    return (
        <div >
            {!isLoading && (
                <div className="mt-6 space-y-4">
                    <ShareLinkBox title="초대 링크" description="복사하려면 클릭하세요" url={inviteLink} />

                    <div>
                        <p className="text-sm font-medium mb-2">👥 공유된 사용자</p>
                        {users.length === 0 ? (
                            <p className="text-sm text-muted-foreground">아직 공유된 사용자가 없습니다</p>
                        ) : (
                            <div className="space-y-2">
                                {users.map(user => (
                                    <div
                                        key={user.userId}
                                        className="flex items-center justify-between rounded-lg border px-4 py-2"
                                    >
                                        <div className="text-sm">{user.email}</div>
                                        <select
                                            value={user.permission}
                                            onChange={e =>
                                                updatePermission(user.userId, e.target.value as 'READ' | 'WRITE')
                                            }
                                            className="border rounded-md px-2 py-1 text-sm"
                                            disabled={isLoading}
                                        >
                                            <option value="READ">읽기</option>
                                            <option value="WRITE">쓰기</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
