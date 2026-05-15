import { motion } from 'framer-motion'
import { canRedeemReward } from '../../utils/helpers'
import { Gift, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function RewardsProgress({ rewards = [], userStamps = 0, onRedeem }) {
  const maxStamps = Math.max(...rewards.map((r) => r.stamps), 20)

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Your Progress</h3>
          <span className="text-amber-400 font-bold text-lg">{userStamps} stamps</span>
        </div>

        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((userStamps / maxStamps) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 rounded-full"
          />
          {/* Milestone markers */}
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="absolute top-0 bottom-0 w-0.5 bg-white/30"
              style={{ left: `${(reward.stamps / maxStamps) * 100}%` }}
            />
          ))}
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-600">0</span>
          {rewards.map((r) => (
            <span key={r.id} className="text-xs text-zinc-500">{r.stamps}</span>
          ))}
        </div>
      </div>

      {/* Reward cards */}
      {rewards.map((reward, i) => {
        const canRedeem = canRedeemReward(userStamps, reward.stamps)
        const remaining = Math.max(reward.stamps - userStamps, 0)

        return (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={clsx(
              'glass-card p-5 transition-all duration-300',
              canRedeem && 'border-amber-500/30 bg-amber-500/5'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={clsx(
                'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border',
                canRedeem
                  ? 'bg-amber-500/20 border-amber-500/40'
                  : 'bg-white/5 border-white/10'
              )}>
                {reward.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className={clsx(
                      'font-semibold text-base',
                      canRedeem ? 'text-amber-300' : 'text-zinc-300'
                    )}>
                      {reward.name}
                    </h4>
                    <p className="text-zinc-500 text-sm mt-0.5 leading-relaxed">{reward.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={clsx('font-bold text-lg', canRedeem ? 'text-amber-400' : 'text-zinc-500')}>
                      {reward.stamps}
                    </div>
                    <div className="text-zinc-600 text-xs">stamps</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {canRedeem ? (
                    <button
                      onClick={() => onRedeem?.(reward)}
                      className="btn-gold text-sm py-2 px-4"
                    >
                      <Gift size={14} />
                      Redeem Reward
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Lock size={13} />
                      <span>{remaining} more stamp{remaining !== 1 ? 's' : ''} needed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mini progress */}
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((userStamps / reward.stamps) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                className={clsx(
                  'h-full rounded-full',
                  canRedeem ? 'bg-amber-500' : 'bg-zinc-600'
                )}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
