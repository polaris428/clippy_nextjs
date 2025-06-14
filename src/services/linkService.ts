import { CreateLinkInput } from '@/types/CreateLinkInput';
import { Link } from '@/types/links/link';
import { fetchWithFirebaseRetry } from '@/lib/utils/fetchWithAuthRetry';
export const LinkService = {
  async createLink({ title, url, description, image, favicon, folderId }: CreateLinkInput): Promise<Link> {
    try {
      const res = await fetchWithFirebaseRetry('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          url,
          description,
          image,
          favicon,
          folderId,
        }),
      });

      const json = await res.json();

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
  async getLinkById(linkId: string): Promise<Link> {
    try {
      const res = await fetchWithFirebaseRetry(`/api/links/${linkId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        const errorText = json?.message || '링크 조회 실패';
        console.error('❌ 링크 조회 실패:', errorText);
        throw new Error(errorText);
      }

      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 조회 중 예외 발생:', err);
      throw err;
    }
  },
  async updateLink(linkId: string, data: Partial<Pick<Link, 'title' | 'description' | 'isPin'>>): Promise<Link> {
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        const errorText = await res.text();
        console.error('❌ 링크 수정 실패:', errorText);
        throw new Error(errorText || '링크 수정 실패');
      }

      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 수정 중 예외 발생:', err);
      throw err;
    }
  },
};
