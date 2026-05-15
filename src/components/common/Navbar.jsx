import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Scissors, Bell, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useAppStore from '../../store/appStore'
import { getInitials } from '../../utils/helpers'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/barbers', label: 'Our Barbers' },
  { to: '/booking', label: 'Book Now', highlight: true },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <Scissors size={18} className="text-black" />
            </div>
            <span className="font-serif text-xl font-bold tracking-widest text-white">BARBEROS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  link.highlight
                    ? 'btn-gold ml-2 text-sm'
                    : `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-amber-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-xs font-bold">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-white leading-none">{user?.name?.split(' ')[0]}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{user?.stamps || 0} stamps</div>
                  </div>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-card-dark py-2 shadow-2xl"
                    >
                      {isAdmin() && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <LayoutDashboard size={15} />
                            Admin Dashboard
                          </Link>
                          <div className="border-t border-white/10 my-1" />
                        </>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User size={15} />
                        My Profile
                      </Link>
                      <Link
                        to="/appointments"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Bell size={15} />
                        My Appointments
                      </Link>
                      <Link
                        to="/rewards"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm">⭐</span>
                        My Rewards
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-gold text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-white/10">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        link.highlight
                          ? 'bg-amber-500 text-black font-semibold'
                          : isActive
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="pt-2 border-t border-white/10">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-amber-500/50" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-sm">
                            {getInitials(user?.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium text-sm">{user?.name}</div>
                          <div className="text-zinc-500 text-xs">{user?.stamps || 0} loyalty stamps</div>
                        </div>
                      </div>
                      {isAdmin() && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">My Profile</Link>
                      <Link to="/rewards" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">My Rewards</Link>
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 px-4">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center btn-gold text-sm justify-center">
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
