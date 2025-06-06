'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { LinkService } from '@/services/LinkService';
import { CreateLinkInput } from '@/types/CreateLinkInput';
import { v4 as uuid } from 'uuid';
import { Link } from '@/types/links/link';

export function useCreateLink() {
  const addLink = useAuthStore(s => s.addLinkToFolder);
  const updateLink = useAuthStore(s => s.updateLinkInFolder);

  async function createLink(input: CreateLinkInput): Promise<boolean> {
    const tempId = `temp-${uuid()}`;

    const dummyLink: Link = {
      id: tempId,
      title: input.title,
      url: input.url,
      folderId: input.folderId,
      createdAt: new Date(),
      description: '',
      thumbnail: '',
      favicon: '',
      isPin: false,
    };

    addLink(input.folderId, dummyLink);

    try {
      const realLink = await LinkService.createLink(input);

      updateLink(input.folderId, tempId, realLink);
      console.log('서버로 전송3');
      return true;
    } catch (err) {
      console.error('🔥 링크 생성 실패:', err);
      updateLink(input.folderId, tempId, {
        ...dummyLink,
        title: '[저장 실패]',
      });
      return false;
    }
  }

  return { createLink };
}
