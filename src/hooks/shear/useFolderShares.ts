import { useEffect, useState } from 'react';
import { SharedUser } from '@/types/share/shared-user';
import { FolderService } from '@/services/FolderService';
import logger from '@/lib/logger/logger';

export function useFolderShares(folderId: string, enabled: boolean) {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !folderId) return;

    const fetchShares = async () => {
      const data = await FolderService.fetchShares(folderId);
      setUsers(data.users);
    };

    fetchShares();
  }, [folderId, enabled]);

  const updatePermission = async (userId: string, permission: 'READ' | 'WRITE') => {
    setIsLoading(true);
    try {
      await FolderService.updatePermission(folderId, userId, permission);
      setUsers(prev => prev.map(user => (user.userId === userId ? { ...user, permission } : user)));
    } catch (e) {
      logger.error(e);
      alert('권한 변경 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return { users, updatePermission, isLoading };
}
