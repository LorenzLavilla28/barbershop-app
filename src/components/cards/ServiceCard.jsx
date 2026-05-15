import { motion } from 'framer-motion'
import { Clock, DollarSign, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import { Link } from 'react-router-dom'

export default function ServiceCard({ service, index = 0, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Image / Gradient Banner */}
      <div className={`h-44 bg-gradient-to-br ${service.gradient || 'from-zinc-800 to-zinc-900'} relative overflow-hidden flex items-center justify-center`}>
        <span className="text-6xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
          {service.icon}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${service.available ? 'badge-green' : 'badge-red'}`}>
            {service.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="badge-zinc badge text-xs capitalize">{service.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-amber-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <Clock size={14} className="text-amber-500" />
            <span>{service.duration} min</span>
          </div>
          <div className="text-amber-400 font-bold text-lg">
            {formatCurrency(service.price)}
          </div>
        </div>

        <button
          onClick={() => onBook?.(service)}
          className="btn-gold w-full justify-center text-sm group-hover:bg-amber-400 transition-colors"
        >
          Book This Service
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}
