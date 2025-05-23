
import Sidebar from '@/components/sidebar/Sidebar';
import AppHeader from '@/components/Header/AppHeader';
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
    console.log(token)
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
  console.log(user.profileImage)
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader userImageUrl={user.profileImage ?? ""} />
      <div className="flex flex-1 overflow-y-auto">
        <aside className="w-80 flex-shrink-0 h-full overflow-y-auto ">

          <Sidebar initialFolders={folders} />
        </aside>
        <main className="flex-1 overflow-y-auto bg-white p-6">{children}</main>
      </div>


    </div>

  );
}
