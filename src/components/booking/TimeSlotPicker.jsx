import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { formatTime } from '../../utils/helpers'
import clsx from 'clsx'

export default function TimeSlotPicker({ slots = [], selectedSlot, onSelect }) {
  if (!slots.length) {
    return (
      <div className="glass-card p-8 text-center">
        <Clock size={40} className="text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-500">Select a date to view available time slots</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock size={16} className="text-amber-500" />
        Available Times
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot, i) => (
          <motion.button
            key={slot.time}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={clsx(
              'py-2.5 px-3 rounded-xl text-sm font-medium transition-all',
              selectedSlot === slot.time
                ? 'bg-amber-500 text-black font-bold'
                : slot.available
                ? 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                : 'bg-white/5 border border-white/5 text-zinc-600 cursor-not-allowed line-through'
            )}
          >
            {formatTime(slot.time)}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-xs text-zinc-500">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/10 border border-white/20" />
          <span className="text-xs text-zinc-500">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
          <span className="text-xs text-zinc-500">Booked</span>
        </div>
      </div>
    </div>
  )
}
