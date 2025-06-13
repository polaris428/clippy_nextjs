import { useEffect, useState } from 'react';
import { FolderService } from '@/services/FolderService';
import { SharedUser } from '@/types/shear/shared-user';

export function useFolderShares(folderId: string, isInvite: boolean) {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShares = async () => {
    try {
      setIsLoading(true);
      const data = await FolderService.fetchShares(folderId);
      console.log('유저정보', data);
      setUsers(data.users);
    } catch (err) {
      console.error('📛 공유된 사용자 불러오기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (userId: string, permission: 'READ' | 'WRITE') => {
    try {
      await FolderService.updatePermission(folderId, userId, permission);
      setUsers(prev => prev.map(user => (user.userId === userId ? { ...user, permission } : user)));
    } catch (err) {
      console.error('📛 권한 변경 실패:', err);
    }
  };

  useEffect(() => {
    if (isInvite) fetchShares();
  }, [folderId, isInvite]);

  return {
    users,
    updatePermission,
    isLoading,
  };
}
