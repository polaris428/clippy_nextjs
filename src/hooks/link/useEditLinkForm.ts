'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { LinkService } from '@/services/LinkService';
import type { Link } from '@/types/links/link';

export function useEditLinkForm(link: Link) {
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description || '');
  const [image, setImage] = useState(link.thumbnail || '');
  const [favicon, setFavicon] = useState(link.favicon || '');
  const [folderId, setFolderId] = useState(link.folderId);

  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isMetadataFetched, setIsMetadataFetched] = useState(true); // 기존 메타데이터 있음
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const updateLink = useAuthStore(s => s.updateLinkInFolder);

  const lastCrawledUrl = useRef(link.url);
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
      console.error('❌ 메타데이터 크롤링 실패:', err);
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

    try {
      const updatedLink = await LinkService.updateLink(link.id, {
        title,
        description,
      });

      updateLink(folderId, link.id, updatedLink);
      router.push(`/folders/${folderId}`);
    } catch (err) {
      console.error('❌ 링크 수정 실패:', err);
      alert('링크 수정에 실패했습니다.');
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
