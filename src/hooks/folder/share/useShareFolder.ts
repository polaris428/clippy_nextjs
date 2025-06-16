import { useEffect, useState } from 'react';
import { FolderService } from '@/services/FolderService';
import { SharedUser } from '@/types/share/shared-user';
import logger from '@/lib/logger/logger';

export function useFolderShares(folderId: string, isInvite: boolean) {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShares = async () => {
    try {
      setIsLoading(true);
      const data = await FolderService.fetchShares(folderId);

      setUsers(data.users);
    } catch (err) {
      logger.error({ err }, '📛 공유된 사용자 불러오기 실패:');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (userId: string, permission: 'READ' | 'WRITE') => {
    try {
      await FolderService.updatePermission(folderId, userId, permission);
      setUsers(prev => prev.map(user => (user.userId === userId ? { ...user, permission } : user)));
    } catch (err) {
      logger.error({ err }, '📛 권한 변경 실패:');
    }
  };

  useEffect(() => {
    if (isInvite) fetchShares();
  });

  return {
    users,
    updatePermission,
    isLoading,
  };
}
