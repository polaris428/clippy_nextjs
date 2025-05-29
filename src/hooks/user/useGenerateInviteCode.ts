export const useGenerateInviteCode = () => {
  return async (folderId: string): Promise<string> => {
    console.log('sdfsadfdfdsdsddsd');
    const res = await fetch(`/api/folders/${folderId}/invite`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('초대 코드 생성 실패');
    }

    const data = await res.json();
    return data.inviteCode as string;
  };
};
