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

    // 1️⃣ 더미 추가
    addLink(input.folderId, dummyLink);

    try {
      // 2️⃣ 서버로 전송
      console.log('서버로 전송1');
      const realLink = await LinkService.createLink(input);
      console.log(realLink);
      // 3️⃣ 응답 온 링크로 갱신
      updateLink(input.folderId, tempId, realLink);
      console.log('서버로 전송3');
      return true;
    } catch (err) {
      console.error('🔥 링크 생성 실패:', err);

      // 4️⃣ 실패한 링크 표시
      updateLink(input.folderId, tempId, {
        ...dummyLink,
        title: '[저장 실패]',
      });
      return false;
    }
  }

  return { createLink };
}
