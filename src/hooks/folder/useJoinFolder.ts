import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FolderService } from '@/services/FolderService';

export type JoinStatus = 'idle' | 'loading' | 'success' | 'error';

export function useJoinFolder(autoRedirect = true) {
  const router = useRouter();
  const params = useParams<{ code: string }>();

  const [status, setStatus] = useState<JoinStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!params.code) return;

    const join = async () => {
      setStatus('loading');

      const result = await FolderService.joinFolder(params.code);

      if (result.success && result.folderId) {
        setStatus('success');
        if (autoRedirect) {
          setTimeout(() => {
            router.push(`/folders/${result.folderId}`);
          }, 1000);
        }
      } else {
        setStatus('error');
        setErrorMessage(result.error || '폴더 참가에 실패했습니다.');
      }
    };

    join();
  }, [params.code, router, autoRedirect]);

  return {
    status,
    errorMessage,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
