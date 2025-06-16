import { useCallback } from 'react';
import { Link } from '@/types/links/link';
import { LinkService } from '@/services/LinkService';
import { useAuthStore } from '@/stores/useAuthStore';
import logger from '@/lib/logger/logger';

export function useDeleteLink() {
  const removeLink = useAuthStore(state => state.removeLink);
  const addLinkToFolder = useAuthStore(state => state.addLinkToFolder);

  const deleteLink = useCallback(
    async (link: Link): Promise<void> => {
      removeLink(link.id);
      try {
        await LinkService.deleteLink(link.id);
      } catch (err) {
        logger.error({ err }, '❌ 삭제 실패, 롤백 중...');
        alert('링크 삭제에 실패했습니다.');
        addLinkToFolder(link.folderId, link);
      }
    },
    [removeLink, addLinkToFolder]
  );

  return { deleteLink };
}
