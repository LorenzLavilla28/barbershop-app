import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CalendarDays, Scissors, Users, Gift,
  UserCircle, LogOut, ChevronRight, Settings,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useAppStore from '../../store/appStore'
import { getInitials } from '../../utils/helpers'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/barbers', icon: UserCircle, label: 'Barbers' },
  { to: '/admin/rewards', icon: Gift, label: 'Loyalty & Rewards' },
  { to: '/admin/users', icon: Users, label: 'Customers' },
]

export default function AdminSidebar() {
  const { user, logout } = useAuthStore()
  const { isAdminSidebarOpen, toggleAdminSidebar } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-white/10 flex flex-col z-40
                  transition-transform duration-300 lg:translate-x-0
                  ${isAdminSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <Scissors size={18} className="text-black" />
          </div>
          <div>
            <div className="font-serif font-bold text-white tracking-widest leading-none">BARBEROS</div>
            <div className="text-xs text-zinc-500 mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => toggleAdminSidebar()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-amber-400/50" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings size={18} className="text-zinc-500" />
            View Live Site
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover border border-amber-500/50" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user?.name}</div>
            <div className="text-zinc-500 text-xs truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
