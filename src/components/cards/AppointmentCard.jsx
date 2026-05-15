import { motion } from 'framer-motion'
import { Calendar, Clock, User, Scissors, XCircle } from 'lucide-react'
import { formatDate, formatCurrency, formatTime } from '../../utils/helpers'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'

export default function AppointmentCard({ appointment, onCancel, index = 0 }) {
  const statusClass = STATUS_COLORS[appointment.status] || 'badge-zinc'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Scissors size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{appointment.serviceName}</h3>
            <p className="text-zinc-500 text-sm flex items-center gap-1.5 mt-0.5">
              <User size={12} />
              {appointment.barberName}
            </p>
          </div>
        </div>
        <span className={statusClass}>
          {STATUS_LABELS[appointment.status] || appointment.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Calendar size={13} className="text-amber-500 shrink-0" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Clock size={13} className="text-amber-500 shrink-0" />
          <span>{formatTime(appointment.timeSlot)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div>
          <span className="text-zinc-500 text-xs">Amount</span>
          <div className="text-amber-400 font-bold">{formatCurrency(appointment.servicePrice)}</div>
        </div>
        <div className="flex gap-2">
          {appointment.status === 'pending_payment' && onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
            >
              <XCircle size={13} />
              Cancel
            </button>
          )}
          <div className="text-xs text-zinc-600">
            #{appointment.id}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
