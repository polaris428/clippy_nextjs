'use client';

import { useCallback } from 'react';
import { LinkService } from '@/services/LinkService';
import { useAuthStore } from '@/stores/useAuthStore';
import { Link } from '@/types/links/link';
import logger from '@/lib/logger/logger';

type UpdateData = Partial<Pick<Link, 'title' | 'description' | 'isPin'>>;

export function useUpdateLink() {
  const folders = useAuthStore(state => state.folders);
  const updateLinkInFolder = useAuthStore(state => state.updateLinkInFolder);

  const updateLink = useCallback(
    async (id: string, data: UpdateData) => {
      try {
        const folder = folders.find(f => f.links?.some(l => l.id === id));
        if (!folder) {
          logger.warn('링크가 속한 폴더를 찾을 수 없습니다.');

          return;
        }

        const updatedLink = await LinkService.updateLink(id, data);
        updateLinkInFolder(folder.id, id, updatedLink);
      } catch (err) {
        logger.error('❌ 링크 수정 실패:', err);
        alert('링크 수정에 실패했습니다.');
      }
    },
    [folders, updateLinkInFolder]
  );

  return { updateLink };
}
