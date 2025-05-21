import { CreateLinkInput } from '@/types/CreateLinkInput';

export const LinkService = {
  async createLink({ title, url, folderId }: CreateLinkInput): Promise<boolean> {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, url, folderId }),
      });

      if (!res.ok) {
        console.error('❌ 링크 생성 실패', await res.text());
        return false;
      }

      return true;
    } catch (err) {
      console.error('🔥 링크 생성 중 예외 발생:', err);
      return false;
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
