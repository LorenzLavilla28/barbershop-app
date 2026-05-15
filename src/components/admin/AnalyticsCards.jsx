import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function AnalyticsCards({ cards = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              {card.change !== undefined && (
                <p className={clsx(
                  'text-xs mt-1 flex items-center gap-1',
                  card.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}% vs last month
                </p>
              )}
            </div>
            <div className={clsx(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              card.iconBg || 'bg-amber-500/15'
            )}>
              {card.icon && <card.icon size={20} className={card.iconColor || 'text-amber-400'} />}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
