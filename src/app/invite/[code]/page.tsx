'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function InvitePage() {
    const params = useParams<{ code: string }>();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    useEffect(() => {


        const join = async () => {
            try {
                const res = await fetch('/api/folders/join', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        inviteCode: params.code,
                    }),
                });

                if (!res.ok) {
                    alert('초대 코드가 유효하지 않거나 이미 참가했습니다.');
                    router.replace('/');
                    return;
                }

                const { folderId } = await res.json();
                alert('✅ 참가 완료!');
                router.push(`/folders/${folderId}`);
            } catch (err) {
                console.error('초대 참가 실패:', err);
                alert('참가 중 오류가 발생했습니다.');
                router.replace('/');
            }
        };

        join();
    }, [params.code, user, router]);

    return <p className="p-6 text-gray-600">폴더에 참가 중...</p>;
}
