import Sidebar from '@/components/Sidebar';
import prisma from '@/lib/prisma';
import { getAuthCookie } from '@/lib/utils/cookies';
import { verifyIdToken } from '@/lib/firebase';
import { redirect } from 'next/navigation';

interface FolderLayoutProps {
  children: React.ReactNode;
}

export default async function FolderLayout({ children }: FolderLayoutProps) {
  const token = await getAuthCookie();
  if (!token) return redirect('/');

  let uid = '';
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch (err) {
    console.error('❌ 토큰 검증 실패:', err);
    return redirect('/');
  }


  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    return redirect('/');
  }


  const folders = await prisma.folder.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 shadow-sm">
        {/* props로 초기 폴더 목록 전달 */}
        <Sidebar initialFolders={folders} />
      </aside>
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
