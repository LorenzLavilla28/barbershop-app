import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function LoyaltyStampCard({ stamps = 0, maxStamps = 10, label = 'stamps to next reward' }) {
  const rows = Math.ceil(maxStamps / 5)
  const stampsGrid = Array.from({ length: maxStamps }, (_, i) => i < stamps)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Loyalty Stamps</h3>
          <p className="text-zinc-500 text-sm">{label}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">{stamps}</div>
          <div className="text-zinc-500 text-xs">/ {maxStamps} stamps</div>
        </div>
      </div>

      {/* Stamps grid */}
      <div className="grid grid-cols-5 gap-2">
        {stampsGrid.map((filled, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={clsx(
              'aspect-square rounded-xl flex items-center justify-center text-lg border transition-all',
              filled
                ? 'bg-amber-500/20 border-amber-500/50'
                : 'bg-white/5 border-white/10'
            )}
          >
            {filled ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: i * 0.05 }}
              >
                ✂️
              </motion.span>
            ) : (
              <span className="w-3 h-3 rounded-full border-2 border-white/20" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stamps / maxStamps) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-zinc-600">0</span>
          <span className="text-xs text-zinc-600">{maxStamps}</span>
        </div>
      </div>
    </div>
  )
}
