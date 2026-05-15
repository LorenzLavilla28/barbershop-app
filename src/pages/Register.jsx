import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import { authAPI } from '../api/authAPI'
import useAuthStore from '../store/authStore'
import { registerValidator, hasErrors } from '../utils/validators'
import toast from 'react-hot-toast'

export default function Register() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = registerValidator(values)
    if (hasErrors(validationErrors)) { setErrors(validationErrors); return }

    setIsLoading(true)
    try {
      const { user, token } = await authAPI.register(values)
      login(user, token)
      toast.success(`Welcome to BARBEROS, ${user.name.split(' ')[0]}!`)
      navigate('/')
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
        <p className="text-zinc-500 text-sm">Join BARBEROS and start your premium grooming journey</p>
      </div>

      {errors.general && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
          <AlertCircle size={16} className="shrink-0" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="label-dark">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input name="name" type="text" value={values.name} onChange={handleChange} placeholder="Juan dela Cruz" className={`input-dark pl-10 ${errors.name ? 'border-red-500/50' : ''}`} />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label-dark">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input name="email" type="email" value={values.email} onChange={handleChange} placeholder="you@example.com" className={`input-dark pl-10 ${errors.email ? 'border-red-500/50' : ''}`} />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="label-dark">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input name="phone" type="tel" value={values.phone} onChange={handleChange} placeholder="09171234567" className={`input-dark pl-10 ${errors.phone ? 'border-red-500/50' : ''}`} />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label-dark">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input name="password" type={showPass ? 'text' : 'password'} value={values.password} onChange={handleChange} placeholder="Min. 6 characters" className={`input-dark pl-10 pr-12 ${errors.password ? 'border-red-500/50' : ''}`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label-dark">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input name="confirmPassword" type={showPass ? 'text' : 'password'} value={values.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className={`input-dark pl-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <p className="text-zinc-600 text-xs mb-5">
          By registering, you agree to our{' '}
          <a href="#" className="text-amber-500/70 hover:text-amber-400">Terms of Service</a> and{' '}
          <a href="#" className="text-amber-500/70 hover:text-amber-400">Privacy Policy</a>.
        </p>

        <button type="submit" disabled={isLoading} className="btn-gold w-full justify-center text-base py-3.5 disabled:opacity-50">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Sign in</Link>
      </div>
    </motion.div>
  )
}
