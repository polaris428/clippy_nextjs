import { CreateLinkInput } from '@/types/CreateLinkInput';
import { Link } from '@/types/links/link';

export const LinkService = {
  async createLink({ title, url, folderId }: CreateLinkInput): Promise<Link> {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, url, folderId }),
      });
      const json = await res.json();
      console.log('티키카타타ㅏ타타타', json);
      console.log('티키카타타ㅏ타타타', json.success);
      if (!res.ok || !json.success) {
        const errorText = await res.text();
        console.error('❌ 링크 생성 실패:', errorText);
        throw new Error(errorText || '링크 생성 실패');
      }

      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 생성 중 예외 발생:', err);
      throw err;
    }
  },
  async deleteLink(linkId: string): Promise<void> {
    const res = await fetch(`/api/links/${linkId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error((await res.text()) || '링크 삭제 실패');
    }
  },
};
