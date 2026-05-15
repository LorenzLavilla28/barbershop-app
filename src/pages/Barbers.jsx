import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Calendar, Instagram, X } from 'lucide-react'
import BarberCard from '../components/cards/BarberCard'
import { barberAPI } from '../api/barberAPI'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import Modal from '../components/common/Modal'
import useAuthStore from '../store/authStore'
import { dayLabel } from '../utils/helpers'

export default function Barbers() {
  const [barbers, setBarbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBarber, setSelectedBarber] = useState(null)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    barberAPI.getAll()
      .then(({ barbers }) => setBarbers(barbers))
      .finally(() => setIsLoading(false))
  }, [])

  const handleBook = (barber) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate('/booking', { state: { barberId: barber.id } })
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Craftsmen
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-heading">
            Meet the Barberos
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-subheading mx-auto">
            Our team of expert barbers brings decades of combined experience, passion, and artistry to every cut.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((b, i) => (
              <BarberCard key={b.id} barber={b} index={i} onBook={handleBook} onView={setSelectedBarber} />
            ))}
          </div>
        )}
      </div>

      {/* Barber Detail Modal */}
      <Modal isOpen={!!selectedBarber} onClose={() => setSelectedBarber(null)} size="lg">
        {selectedBarber && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Photo */}
            <div className="md:col-span-2">
              <div className="relative overflow-hidden rounded-2xl h-72 md:h-full">
                <img
                  src={selectedBarber.image}
                  alt={selectedBarber.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={`badge ${selectedBarber.active ? 'badge-green' : 'badge-red'}`}>
                    {selectedBarber.active ? 'Available' : 'Off Today'}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl font-bold text-white mb-1">{selectedBarber.name}</h2>
              <p className="text-amber-400 font-medium mb-3">{selectedBarber.specialty}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-zinc-300">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <strong>{selectedBarber.rating}</strong>
                  <span className="text-zinc-500">({selectedBarber.reviewCount} reviews)</span>
                </div>
                <span className="text-zinc-500 text-sm">{selectedBarber.experience} experience</span>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-5">{selectedBarber.bio}</p>

              {/* Schedule */}
              <div className="mb-5">
                <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Weekly Schedule</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedBarber.schedule).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                      <span className="text-zinc-400 font-medium">{dayLabel(day)}</span>
                      {hours ? (
                        <span className="text-emerald-400">{hours.open} – {hours.close}</span>
                      ) : (
                        <span className="text-zinc-600">Off</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              {selectedBarber.social?.instagram && (
                <div className="flex items-center gap-2 mb-5">
                  <a
                    href={`https://instagram.com/${selectedBarber.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    <Instagram size={14} />
                    {selectedBarber.social.instagram}
                  </a>
                </div>
              )}

              <button
                onClick={() => { setSelectedBarber(null); handleBook(selectedBarber) }}
                className="btn-gold w-full justify-center"
              >
                <Calendar size={16} />
                Book with {selectedBarber.name.split(' ')[0]}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
