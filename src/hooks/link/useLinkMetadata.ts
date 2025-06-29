import logger from '@/lib/logger/logger';
import { useState, useEffect, useRef } from 'react';

export function useLinkMetadata(url: string) {
  const [title, setTitle] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const lastCrawledUrl = useRef<string>('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!url || !url.startsWith('http')) {
      setIsFetched(false);
      setTitle('');
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (url === lastCrawledUrl.current) return;
      fetchMetadata(url);
    }, 700);
  }, [url]);

  const fetchMetadata = async (inputUrl: string) => {
    setIsFetching(true);
    setIsFetched(false);
    try {
      const res = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const meta = await res.json();
      setTitle(meta.title?.trim() || '값을 입력해주세요');
      lastCrawledUrl.current = inputUrl;
      setIsFetched(true);
    } catch (err) {
      logger.error({ err }, '❌ 크롤링 실패:');
      setTitle('값을 입력해주세요');
    } finally {
      setIsFetching(false);
    }
  };

  return {
    title,
    isFetching,
    isFetched,
    setTitle,
  };
}
