'use client';

import { useJoinFolder } from '@/hooks/folder/useJoinFolder';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvitePage() {
    const { errorMessage, isLoading, isSuccess, isError } = useJoinFolder();
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center space-y-4 border">
                {isLoading && (
                    <>
                        <Loader2 className="animate-spin mx-auto text-blue-500 w-10 h-10" />
                        <h2 className="text-lg font-semibold text-gray-700">폴더에 참가 중입니다...</h2>
                        <p className="text-gray-500 text-sm">잠시만 기다려 주세요.</p>
                    </>
                )}

                {isSuccess && (
                    <>
                        <CheckCircle className="text-green-500 w-10 h-10 mx-auto" />
                        <h2 className="text-lg font-semibold text-green-600">참가 완료!</h2>
                        <p className="text-gray-500 text-sm">폴더로 이동 중입니다...</p>
                    </>
                )}

                {isError && (
                    <>
                        <XCircle className="text-red-500 w-10 h-10 mx-auto" />
                        <h2 className="text-lg font-semibold text-red-600">참가에 실패했어요</h2>
                        <p className="text-gray-500 text-sm">{errorMessage}</p>
                        <button
                            onClick={() => router.replace('/')}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                        >
                            홈으로 돌아가기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}