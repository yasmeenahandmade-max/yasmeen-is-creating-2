import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function AdminLayout({ children, params }: Props) {
  const session = await getAdminSession();

  if (!session) {
    redirect(`/${params.locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-gray-50/80 flex">
      {/* Sidebar */}
      <AdminSidebar
        locale={params.locale}
        userRole={session.user.role}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar */}
        <AdminTopBar
          user={session.user}
          locale={params.locale}
        />

        {/* Page content */}
        <div className="flex-1 p-5 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
