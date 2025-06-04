import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/features/layout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 这里可以添加更多的权限检查
  // 例如检查用户是否是管理员
  
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8 max-w-full">
          <div className="bg-background min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 