'use client';

import { useCallback } from 'react';
import { LinkService } from '@/services/LinkService';

export function useDeleteLink() {
  const deleteLink = useCallback(async (linkId: string): Promise<void> => {
    await LinkService.deleteLink(linkId);
  }, []);

  return { deleteLink };
}
