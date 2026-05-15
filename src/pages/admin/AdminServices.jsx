import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/common/Modal'
import { serviceAPI } from '../../api/serviceAPI'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', duration: 30, price: 0, category: 'hair', icon: '✂️', gradient: 'from-zinc-800 to-zinc-900' }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = () => {
    serviceAPI.getAllAdmin()
      .then(({ services }) => setServices(services))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true) }
  const openEdit = (service) => {
    setForm({ name: service.name, description: service.description, duration: service.duration, price: service.price, category: service.category, icon: service.icon, gradient: service.gradient || emptyForm.gradient })
    setEditId(service.id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setIsSaving(true)
    try {
      if (editId) {
        await serviceAPI.update(editId, form)
        setServices((prev) => prev.map((s) => s.id === editId ? { ...s, ...form } : s))
        toast.success('Service updated!')
      } else {
        const { service } = await serviceAPI.create(form)
        setServices((prev) => [...prev, service])
        toast.success('Service created!')
      }
      setModalOpen(false)
    } catch {
      toast.error('Failed to save service')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await serviceAPI.delete(id)
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success('Service deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggle = async (id) => {
    try {
      const { service } = await serviceAPI.toggleAvailability(id)
      setServices((prev) => prev.map((s) => s.id === id ? { ...s, available: service.available } : s))
    } catch {
      toast.error('Failed to toggle')
    }
  }

  const columns = [
    { key: 'icon', label: '', render: (v) => <span className="text-2xl">{v}</span> },
    { key: 'name', label: 'Service', sortable: true, render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'category', label: 'Category', render: (v) => <span className="capitalize badge-zinc badge text-xs">{v}</span> },
    { key: 'duration', label: 'Duration', render: (v) => `${v} min` },
    { key: 'price', label: 'Price', sortable: true, render: (v) => <span className="text-amber-400 font-semibold">{formatCurrency(v)}</span> },
    {
      key: 'available', label: 'Status',
      render: (v) => <span className={v ? 'badge-green' : 'badge-red'}>{v ? 'Available' : 'Hidden'}</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleToggle(row.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
            {row.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </button>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your barbershop service offerings</p>
        </div>
        <button onClick={openCreate} className="btn-gold text-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <AdminTable columns={columns} data={services} isLoading={isLoading} searchable searchPlaceholder="Search services..." emptyMessage="No services found" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4">
          <div>
            <label className="label-dark">Service Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Haircut" className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Service description..." className="input-dark resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Duration (minutes) *</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} min={15} max={300} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Price (PHP) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} className="input-dark" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark">
                {['hair', 'beard', 'skin', 'shave'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-dark">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="✂️" className="input-dark" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="btn-gold flex-1 justify-center">
              {isSaving ? 'Saving...' : editId ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
