'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { useAuthStore } from '@/stores/useAuthStore';
import { LinkService } from '@/services/LinkService';
import { Link } from '@/types/links/link';
import logger from '@/lib/logger/logger';

export function useSaveLinkForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [favicon, setFavicon] = useState('');
  const [folderId, setFolderId] = useState('');

  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isMetadataFetched, setIsMetadataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const addLink = useAuthStore(s => s.addLinkToFolder);
  const updateLink = useAuthStore(s => s.updateLinkInFolder);

  const lastCrawledUrl = useRef('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!url || !url.startsWith('http')) {
      setIsMetadataFetched(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (url === lastCrawledUrl.current) return;
      fetchMetadata(url);
    }, 700);
  }, [url]);

  const fetchMetadata = async (inputUrl: string) => {
    setIsFetchingMeta(true);
    setIsMetadataFetched(false);
    try {
      const res = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const meta = await res.json();

      setTitle(meta.title?.trim() || '값을 입력해주세요');
      setDescription(meta.description?.trim() || '');
      setImage(meta.image || '');
      setFavicon(meta.favicon || '');

      lastCrawledUrl.current = inputUrl;
      setIsMetadataFetched(true);
    } catch (err) {
      logger.error({ err }, '❌ 메타데이터 크롤링 실패:');
      setTitle('값을 입력해주세요');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !folderId || !isMetadataFetched) {
      alert('입력값이 부족하거나 URL이 아직 처리되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    const tempId = `temp-${uuid()}`;

    const dummyLink: Link = {
      id: tempId,
      title,
      url,
      folderId,
      createdAt: new Date(),
      description,
      thumbnail: image,
      favicon,
      isPin: false,
    };

    addLink(folderId, dummyLink);

    try {
      const realLink = await LinkService.createLink({ title, url, folderId });
      updateLink(folderId, tempId, realLink);
      router.push(`/folders/${folderId}`);
    } catch {
      updateLink(folderId, tempId, {
        ...dummyLink,
        title: '[저장 실패]',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    title,
    description,
    image,
    favicon,
    folderId,
    isLoading,
    isFetchingMeta,
    isMetadataFetched,
    setUrl,
    setTitle,
    setDescription,
    setFolderId,
    handleSubmit,
  };
}
