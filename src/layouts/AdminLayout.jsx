import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import useAppStore from '../store/appStore'
import { Menu } from 'lucide-react'

export default function AdminLayout() {
  const { isAdminSidebarOpen, toggleAdminSidebar } = useAppStore()

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Mobile overlay */}
      {isAdminSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={toggleAdminSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-900 border-b border-white/10 sticky top-0 z-20">
          <button
            onClick={toggleAdminSidebar}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif font-bold text-white text-lg tracking-widest">BARBEROS</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
