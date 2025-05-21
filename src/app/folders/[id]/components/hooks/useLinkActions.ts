import { useCallback } from 'react';
import { deleteLink as requestDelete } from '@/services/linkService';

export function useLinkActions(setLocalLinks: Function) {
  const deleteLink = useCallback(async (id: string) => {
    await requestDelete(id);
    setLocalLinks((prev: any[]) => prev.filter(link => link.id !== id));
  }, []);

  return { deleteLink };
}
