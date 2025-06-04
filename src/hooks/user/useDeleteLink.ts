import { useCallback } from 'react';
import { Link } from '@/types/links/link';
import { LinkService } from '@/services/LinkService';
import { useAuthStore } from '@/stores/useAuthStore';

export function useDeleteLink() {
  const removeLink = useAuthStore(state => state.removeLink);
  const addLinkToFolder = useAuthStore(state => state.addLinkToFolder);

  const deleteLink = useCallback(
    async (link: Link): Promise<void> => {
      removeLink(link.id); // Optimistic UI

      try {
        await LinkService.deleteLink(link.id);
      } catch (err) {
        console.error('❌ 삭제 실패, 롤백 중...', err);
        alert('링크 삭제에 실패했습니다.');
        addLinkToFolder(link.folderId, link); // folderId는 Link 객체에 포함되어 있다고 가정
      }
    },
    [removeLink, addLinkToFolder]
  );

  return { deleteLink };
}
