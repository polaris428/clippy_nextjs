'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Folder } from '@/types/folder/folder';
import { FolderService } from '@/services/FolderService';
import { useAuthStore } from '@/stores/useAuthStore';
import logger from '@/lib/logger/logger';

export function useCreateFolderForm() {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [name, setName] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const addFolder = useAuthStore(s => s.addFolder);

  const hasCreatedRef = useRef(false);
  const isTempRef = useRef(true);
  const folderRef = useRef<Folder | null>(null);

  // 폴더 생성
  useEffect(() => {
    if (hasCreatedRef.current) return;
    hasCreatedRef.current = true;

    const createTempFolder = async () => {
      try {
        const { newFolder } = await FolderService.createFolder('새 폴더', false);
        setFolder(newFolder);
        setName(newFolder.name ?? '');
        setIsShared(newFolder.isShared ?? false);
        setIsInvite(newFolder.isInvite ?? false);
        folderRef.current = newFolder;
        isTempRef.current = true;
      } catch (err) {
        logger.info(err);
        alert('임시 폴더 생성에 실패했습니다.');
        router.back();
      }
    };

    createTempFolder();
  }, [router]);

  // 이탈 시 임시 폴더 삭제
  useEffect(() => {
    const handleBeforeUnload = () => {
      const f = folderRef.current;
      if (f?.id && isTempRef.current) {
        FolderService.deleteFolder(f.id);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 폴더 저장
  const handleSubmit = useCallback(async () => {
    if (!folder) return;
    if (!name.trim()) {
      alert('폴더 이름을 입력하세요.');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await FolderService.updateFolder(folder.id, {
        name: name.trim(),
        isShared,
        isInvite,
        isTemp: false,
      });

      setFolder(updated);
      folderRef.current = updated;
      isTempRef.current = false;

      addFolder(updated);
      router.push(`/folders/${updated.id}`);
    } catch {
      alert('폴더 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [folder, name, isShared, isInvite, addFolder, router]);

  const shareLink = useMemo(() => (folder ? `${window.location.origin}/shared/${folder.id}` : ''), [folder]);
  const inviteLink = useMemo(() => (folder ? `${window.location.origin}/invite/${folder.id}` : ''), [folder]);

  return {
    folder,
    name,
    isShared,
    isInvite,
    isLoading,
    setName,
    setIsShared,
    setIsInvite,
    handleSubmit,
    shareLink,
    inviteLink,
  };
}
