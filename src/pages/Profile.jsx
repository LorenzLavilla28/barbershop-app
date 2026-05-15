import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, Edit2, Save, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useAuthStore from '../store/authStore'
import { authAPI } from '../api/authAPI'
import { generateQRData, getInitials } from '../utils/helpers'
import QRCodeCard from '../components/cards/QRCodeCard'
import LoyaltyStampCard from '../components/cards/LoyaltyStampCard'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authAPI.updateProfile(user.id, form)
      updateUser(form)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({ name: user?.name, phone: user?.phone })
    setIsEditing(false)
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-heading mb-8">
          My Profile
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center hover:bg-amber-400 transition-colors">
                      <Camera size={13} className="text-black" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                    <p className="text-zinc-500 text-sm">{user?.email}</p>
                    <span className={`badge mt-1.5 ${user?.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>
                      {user?.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn-ghost text-sm">
                    <Edit2 size={14} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="btn-ghost text-sm">
                      <X size={14} />
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="btn-gold text-sm py-2 px-4">
                      <Save size={14} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-dark pl-9 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="px-3 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm flex items-center gap-2">
                      <User size={14} className="text-zinc-500" />
                      {user?.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label-dark">Email</label>
                  <div className="px-3 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm flex items-center gap-2">
                    <Mail size={14} className="text-zinc-500" />
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label className="label-dark">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-dark pl-9 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="px-3 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm flex items-center gap-2">
                      <Phone size={14} className="text-zinc-500" />
                      {user?.phone || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label-dark">Member Since</label>
                  <div className="px-3 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' }) : '—'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stamp card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <LoyaltyStampCard
                stamps={user?.stamps || 0}
                maxStamps={15}
                label="stamps collected toward next reward"
              />
            </motion.div>
          </div>

          {/* Right column — QR Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <QRCodeCard user={user} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
