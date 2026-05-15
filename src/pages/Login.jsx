import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { authAPI } from '../api/authAPI'
import useAuthStore from '../store/authStore'
import { loginValidator, hasErrors } from '../utils/validators'
import toast from 'react-hot-toast'

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = loginValidator(values)
    if (hasErrors(validationErrors)) { setErrors(validationErrors); return }

    setIsLoading(true)
    try {
      const { user, token } = await authAPI.login(values.email, values.password)
      login(user, token)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setErrors({ general: err.message || 'Login failed' })
    } finally {
      setIsLoading(false)
    }
  }

  // Quick demo logins
  const demoLogin = async (email, password) => {
    setValues({ email, password })
    setIsLoading(true)
    try {
      const { user, token } = await authAPI.login(email, password)
      login(user, token)
      toast.success(`Logged in as ${user.name.split(' ')[0]}`)
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch {
      toast.error('Demo login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm">Sign in to your BARBEROS account</p>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
          <AlertCircle size={16} className="shrink-0" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 mb-6">
          <div>
            <label className="label-dark">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-dark pl-10 ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label-dark">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-dark pl-10 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-gold w-full justify-center text-base py-3.5 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
          Create one
        </Link>
      </div>

      {/* Demo accounts */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-zinc-600 text-center mb-3 uppercase tracking-wider">Quick Demo Access</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => demoLogin('juan@email.com', 'password123')}
            className="px-3 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-all text-left"
          >
            <div className="font-medium text-zinc-300">Customer</div>
            <div className="text-zinc-600">juan@email.com</div>
          </button>
          <button
            onClick={() => demoLogin('admin@barberos.com', 'admin123')}
            className="px-3 py-2.5 rounded-xl border border-amber-500/20 text-xs text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 transition-all text-left bg-amber-500/5"
          >
            <div className="font-medium text-amber-400">Admin</div>
            <div className="text-zinc-600">admin@barberos.com</div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
