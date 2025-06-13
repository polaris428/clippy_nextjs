import { CreateLinkInput } from '@/types/CreateLinkInput';
import { Link } from '@/types/links/link';
import { fetchWithFirebaseRetry } from '@/lib/utils/fetchWithAuthRetry';
export const LinkService = {
  async createLink({ title, url, description, image, favicon, folderId }: CreateLinkInput): Promise<Link> {
    try {
      const json = await fetchWithFirebaseRetry<{ success: boolean; link: Link }>('/api/links', {
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
      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 생성 중 예외 발생:', err);
      throw err;
    }
  },

  async deleteLink(linkId: string): Promise<void> {
    await fetchWithFirebaseRetry<void>(`/api/links/${linkId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },
  async getLinkById(linkId: string): Promise<Link> {
    try {
      const json = await fetchWithFirebaseRetry<{ success: boolean; link: Link }>(`/api/links/${linkId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 조회 중 예외 발생:', err);
      throw err;
    }
  },
  async updateLink(linkId: string, data: Partial<Pick<Link, 'title' | 'description' | 'isPin'>>): Promise<Link> {
    try {
      const json = await fetchWithFirebaseRetry<{ success: boolean; link: Link }>(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return json.link as Link;
    } catch (err) {
      console.error('🔥 링크 수정 중 예외 발생:', err);
      throw err;
    }
  },
};
