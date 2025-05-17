// app/folders/layout.tsx
import Sidebar from '@/components/Sidebar';

export default function FolderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 shadow-sm">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
