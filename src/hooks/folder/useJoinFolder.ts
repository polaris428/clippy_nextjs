export const useJoinFolder = () => {
  return async (inviteCode: string) => {
    const res = await fetch('/api/folders/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ inviteCode }),
    });

    if (!res.ok) throw new Error('초대 실패');
    return true;
  };
};
