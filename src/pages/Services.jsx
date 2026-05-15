import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceCard from '../components/cards/ServiceCard'
import { serviceAPI } from '../api/serviceAPI'
import { SERVICE_CATEGORIES } from '../utils/constants'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import useAuthStore from '../store/authStore'
import clsx from 'clsx'

export default function Services() {
  const [services, setServices] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    serviceAPI.getAll()
      .then(({ services }) => { setServices(services); setFiltered(services) })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (activeCategory === 'all') setFiltered(services)
    else setFiltered(services.filter((s) => s.category === activeCategory))
  }, [activeCategory, services])

  const handleBook = (service) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate('/booking', { state: { serviceId: service.id } })
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            What We Offer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-heading"
          >
            Premium Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-subheading mx-auto"
          >
            Every service is crafted with precision, care, and premium products for the perfect result.
          </motion.p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={clsx(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                activeCategory === cat.value
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No services in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
