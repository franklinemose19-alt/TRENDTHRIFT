import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#0f0f10] text-[#e8e8e6]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
