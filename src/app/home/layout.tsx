import Sidebar from '@/components/Sidebar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* 왼쪽 고정 네비게이션 */}
            <aside className="w-64 h-screen bg-gray-50 border-r shadow-sm">
                <Sidebar />
            </aside>

            {/* 오른쪽 콘텐츠 영역 */}
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
