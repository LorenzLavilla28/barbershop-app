import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Eye, CalendarDays } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import { appointmentAPI } from '../../api/appointmentAPI'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const load = () => {
    appointmentAPI.getAll()
      .then(({ appointments }) => setAppointments(appointments))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'confirmed')
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'confirmed' } : a))
      if (selectedAppt?.id === id) setSelectedAppt((a) => ({ ...a, status: 'confirmed' }))
      toast.success('Payment verified. Booking confirmed!')
    } catch {
      toast.error('Failed to verify payment')
    }
  }

  const handleComplete = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'completed')
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'completed' } : a))
      if (selectedAppt?.id === id) setSelectedAppt((a) => ({ ...a, status: 'completed' }))
      toast.success('Appointment marked as completed!')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleCancel = async (id) => {
    try {
      await appointmentAPI.cancel(id)
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' } : a))
      setSelectedAppt(null)
      toast.success('Appointment cancelled')
    } catch {
      toast.error('Failed to cancel')
    }
  }

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'payment_submitted', label: 'Payment Submitted' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const filtered = filterStatus === 'all' ? appointments : appointments.filter((a) => a.status === filterStatus)

  const columns = [
    { key: 'id', label: 'Booking ID' },
    { key: 'userName', label: 'Customer', sortable: true },
    { key: 'serviceName', label: 'Service', sortable: true },
    { key: 'barberName', label: 'Barber', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (v) => formatDate(v) },
    { key: 'timeSlot', label: 'Time', render: (v) => formatTime(v) },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v) => <span className={STATUS_COLORS[v]}>{STATUS_LABELS[v] || v}</span>,
    },
    {
      key: 'servicePrice', label: 'Amount',
      render: (v) => <span className="text-amber-400 font-semibold">{formatCurrency(v)}</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedAppt(row)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <Eye size={14} />
          </button>
          {row.status === 'payment_submitted' && (
            <button onClick={() => handleVerify(row.id)} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors">
              <CheckCircle2 size={14} />
            </button>
          )}
          {row.status === 'confirmed' && (
            <button onClick={() => handleComplete(row.id)} className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors">
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Appointments</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage all bookings and payment verifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: appointments.length, color: 'text-white' },
          { label: 'Pending Payment', count: appointments.filter((a) => a.status === 'pending_payment').length, color: 'text-zinc-400' },
          { label: 'Needs Verification', count: appointments.filter((a) => a.status === 'payment_submitted').length, color: 'text-blue-400' },
          { label: 'Confirmed', count: appointments.filter((a) => a.status === 'confirmed').length, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-zinc-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
              filterStatus === f.value
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search appointments..."
        emptyMessage="No appointments found"
      />

      {/* Detail Modal */}
      <Modal isOpen={!!selectedAppt} onClose={() => setSelectedAppt(null)} title="Appointment Details" size="md">
        {selectedAppt && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Booking ID', value: selectedAppt.id },
                { label: 'Customer', value: selectedAppt.userName },
                { label: 'Email', value: selectedAppt.userEmail },
                { label: 'Service', value: selectedAppt.serviceName },
                { label: 'Barber', value: selectedAppt.barberName },
                { label: 'Date', value: formatDate(selectedAppt.date) },
                { label: 'Time', value: formatTime(selectedAppt.timeSlot) },
                { label: 'Payment Method', value: selectedAppt.paymentMethod || 'Not selected' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-zinc-500">{label}</div>
                  <div className="text-white text-sm font-medium mt-0.5">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <div className="text-xs text-zinc-500">Total Amount</div>
                <div className="text-amber-400 font-bold text-lg">{formatCurrency(selectedAppt.servicePrice)}</div>
              </div>
              <span className={STATUS_COLORS[selectedAppt.status]}>{STATUS_LABELS[selectedAppt.status]}</span>
            </div>

            <div className="flex gap-2 pt-2">
              {selectedAppt.status === 'payment_submitted' && (
                <button onClick={() => handleVerify(selectedAppt.id)} className="btn-gold flex-1 justify-center text-sm py-2.5">
                  <CheckCircle2 size={15} /> Verify & Confirm
                </button>
              )}
              {selectedAppt.status === 'confirmed' && (
                <button onClick={() => handleComplete(selectedAppt.id)} className="btn-gold flex-1 justify-center text-sm py-2.5">
                  Mark Completed
                </button>
              )}
              {!['cancelled', 'completed'].includes(selectedAppt.status) && (
                <button
                  onClick={() => handleCancel(selectedAppt.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                >
                  <XCircle size={15} /> Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
