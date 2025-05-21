export async function deleteLink(linkId: string): Promise<void> {
  const res = await fetch(`/api/links/${linkId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('삭제 실패');
}
