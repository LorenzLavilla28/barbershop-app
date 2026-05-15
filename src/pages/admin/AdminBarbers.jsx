import { useEffect, useState } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/common/Modal'
import { barberAPI } from '../../api/barberAPI'
import toast from 'react-hot-toast'

const emptyForm = { name: '', specialty: '', experience: '', bio: '', image: '', social: { instagram: '', facebook: '' } }

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = () => {
    barberAPI.getAllAdmin()
      .then(({ barbers }) => setBarbers(barbers))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (barber) => {
    setForm({ name: barber.name, specialty: barber.specialty, experience: barber.experience, bio: barber.bio, image: barber.image, social: barber.social || { instagram: '', facebook: '' } })
    setEditId(barber.id); setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return }
    setIsSaving(true)
    try {
      if (editId) {
        await barberAPI.update(editId, form)
        setBarbers((prev) => prev.map((b) => b.id === editId ? { ...b, ...form } : b))
        toast.success('Barber updated!')
      } else {
        const { barber } = await barberAPI.create(form)
        setBarbers((prev) => [...prev, barber])
        toast.success('Barber added!')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      const { barber } = await barberAPI.toggleActive(id)
      setBarbers((prev) => prev.map((b) => b.id === id ? { ...b, active: barber.active } : b))
    } catch {
      toast.error('Failed to toggle')
    }
  }

  const columns = [
    {
      key: 'image', label: '',
      render: (v, row) => v ? <img src={v} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-white/20" /> : <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-zinc-400">{row.name?.[0]}</div>,
    },
    { key: 'name', label: 'Barber', sortable: true, render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'specialty', label: 'Specialty' },
    { key: 'experience', label: 'Experience' },
    {
      key: 'rating', label: 'Rating',
      render: (v) => (
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <Star size={12} className="fill-amber-400" /> {v}
        </span>
      ),
    },
    {
      key: 'active', label: 'Status',
      render: (v) => <span className={v ? 'badge-green' : 'badge-red'}>{v ? 'Active' : 'Inactive'}</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleToggle(row.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
            {row.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </button>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Barbers</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your barbershop team</p>
        </div>
        <button onClick={openCreate} className="btn-gold text-sm">
          <Plus size={16} /> Add Barber
        </button>
      </div>

      <AdminTable columns={columns} data={barbers} isLoading={isLoading} searchable searchPlaceholder="Search barbers..." emptyMessage="No barbers found" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Barber' : 'Add Barber'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Full Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Marcus Rodriguez" className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Specialty</label>
              <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Classic & Modern Cuts" className="input-dark" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Experience</label>
              <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="5 years" className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Photo URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="input-dark" />
            </div>
          </div>
          <div>
            <label className="label-dark">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="About the barber..." className="input-dark resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Instagram</label>
              <input value={form.social.instagram} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} placeholder="@handle" className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Facebook</label>
              <input value={form.social.facebook} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} placeholder="page name" className="input-dark" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="btn-gold flex-1 justify-center">
              {isSaving ? 'Saving...' : editId ? 'Save Changes' : 'Add Barber'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
