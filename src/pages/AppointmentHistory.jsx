import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { appointmentAPI } from '../api/appointmentAPI'
import AppointmentCard from '../components/cards/AppointmentCard'
import { isAppointmentUpcoming } from '../utils/helpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function AppointmentHistory() {
  const { user } = useAuthStore()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')

  const loadAppointments = () => {
    appointmentAPI.getByUser(user?.id)
      .then(({ appointments }) => setAppointments(appointments))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { loadAppointments() }, [user?.id])

  const handleCancel = async (id) => {
    try {
      await appointmentAPI.cancel(id)
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' } : a))
      toast.success('Appointment cancelled')
    } catch {
      toast.error('Failed to cancel')
    }
  }

  const upcoming = appointments.filter(
    (a) => isAppointmentUpcoming(a.date) && a.status !== 'cancelled' && a.status !== 'completed'
  )
  const past = appointments.filter(
    (a) => !isAppointmentUpcoming(a.date) || a.status === 'completed' || a.status === 'cancelled'
  )
  const displayed = tab === 'upcoming' ? upcoming : past

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-2">Your Schedule</div>
          <h1 className="section-heading">Appointments</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { key: 'past', label: 'Past', count: past.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                tab === t.key
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {t.label}
              <span className={clsx(
                'text-xs rounded-full w-5 h-5 flex items-center justify-center',
                tab === t.key ? 'bg-black/20' : 'bg-white/10'
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 glass-card animate-pulse" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-zinc-400 font-medium mb-2">No {tab} appointments</h3>
            <p className="text-zinc-600 text-sm">
              {tab === 'upcoming' ? 'Book your next grooming session today.' : 'Your completed appointments will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((appt, i) => (
              <AppointmentCard key={appt.id} appointment={appt} index={i} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
