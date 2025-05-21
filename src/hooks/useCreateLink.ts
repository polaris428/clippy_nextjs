'use client';

import { useCallback } from 'react';
import { LinkService } from '@/services/LinkService';
import { CreateLinkInput } from '@/types/CreateLinkInput';

export function useCreateLink() {
  const createLink = useCallback(async ({ title, url, folderId }: CreateLinkInput): Promise<boolean> => {
    try {
      const success = await LinkService.createLink({ title, url, folderId });
      return success;
    } catch (err) {
      console.error('🔥 링크 생성 중 예외 발생:', err);
      return false;
    }
  }, []);

  return { createLink };
}
