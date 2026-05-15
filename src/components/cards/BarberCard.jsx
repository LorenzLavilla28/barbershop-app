import { motion } from 'framer-motion'
import { Star, Calendar, Instagram, Facebook } from 'lucide-react'

export default function BarberCard({ barber, index = 0, onBook, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass-card overflow-hidden group"
    >
      {/* Photo */}
      <div className="relative overflow-hidden h-64">
        <img
          src={barber.image}
          alt={barber.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

        {/* Active badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${barber.active ? 'badge-green' : 'badge-red'}`}>
            {barber.active ? 'Available' : 'Off Today'}
          </span>
        </div>

        {/* Social links */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {barber.social?.instagram && (
            <a
              href={`https://instagram.com/${barber.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram size={14} />
            </a>
          )}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg font-serif leading-tight">{barber.name}</h3>
          <p className="text-amber-400 text-sm">{barber.specialty}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-white font-semibold text-sm">{barber.rating}</span>
            <span className="text-zinc-500 text-xs">({barber.reviewCount} reviews)</span>
          </div>
          <span className="text-zinc-500 text-xs">{barber.experience} exp.</span>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {barber.bio}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onBook?.(barber)}
            className="btn-gold flex-1 justify-center text-sm"
          >
            <Calendar size={13} />
            Book
          </button>
          <button
            onClick={() => onView?.(barber)}
            className="btn-outline flex-1 justify-center text-sm"
          >
            Profile
          </button>
        </div>
      </div>
    </motion.div>
  )
}
