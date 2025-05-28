export const FolderService = {
  async getFolderAll() {
    const res = await fetch(`/api/folders/all`, { credentials: 'include' });
    if (!res.ok) throw new Error('폴더 조회 실패');
    return await res.json();
  },

  async getFolderById(id: string) {
    const res = await fetch(`/api/folders/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('폴더 조회 실패');
    return await res.json();
  },

  async generateInviteCode(id: string, isInvite: boolean): Promise<string> {
    const res = await fetch(`/api/folders/${id}/invite`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isInvite: isInvite }),
    });
    if (!res.ok) throw new Error('초대 코드 생성 실패');
    const data = await res.json();
    return data.inviteCode;
  },

  async shareFolder(id: string, isShared: boolean): Promise<string | null> {
    const res = await fetch(`/api/folders/${id}/share`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isShared }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.shareKey;
  },
};
