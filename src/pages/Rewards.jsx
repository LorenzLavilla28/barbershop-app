import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { rewardAPI } from '../api/rewardAPI'
import RewardsProgress from '../components/loyalty/RewardsProgress'
import LoyaltyStampCard from '../components/cards/LoyaltyStampCard'
import QRCodeCard from '../components/cards/QRCodeCard'
import Modal from '../components/common/Modal'
import toast from 'react-hot-toast'
import { formatDateTime } from '../utils/helpers'

export default function Rewards() {
  const { user, addStamp } = useAuthStore()
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [redeemTarget, setRedeemTarget] = useState(null)
  const [isRedeeming, setIsRedeeming] = useState(false)

  useEffect(() => {
    Promise.all([
      rewardAPI.getAll(),
      rewardAPI.getUserRedemptions(user?.id),
    ]).then(([{ rewards }, { redemptions }]) => {
      setRewards(rewards)
      setRedemptions(redemptions)
    }).finally(() => setIsLoading(false))
  }, [user?.id])

  const handleRedeem = async () => {
    if (!redeemTarget) return
    setIsRedeeming(true)
    try {
      const { redemption } = await rewardAPI.redeem(user.id, redeemTarget.id)
      setRedemptions([redemption, ...redemptions])
      setRedeemTarget(null)
      toast.success(`Reward redeemed! Bring this confirmation to the shop.`)
    } catch (err) {
      toast.error(err.message || 'Failed to redeem reward')
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-2">Your Loyalty</div>
          <h1 className="section-heading">Rewards & Stamps</h1>
          <p className="text-zinc-400 mt-2">Earn stamps with every visit and redeem them for exclusive rewards.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left — progress */}
          <div className="md:col-span-2 space-y-6">
            <LoyaltyStampCard stamps={user?.stamps || 0} maxStamps={20} label="stamps earned total" />

            <div>
              <h2 className="text-white font-semibold mb-4 text-lg">Available Rewards</h2>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 glass-card animate-pulse" />)}
                </div>
              ) : (
                <RewardsProgress
                  rewards={rewards}
                  userStamps={user?.stamps || 0}
                  onRedeem={setRedeemTarget}
                />
              )}
            </div>
          </div>

          {/* Right — QR + history */}
          <div className="space-y-6">
            <QRCodeCard user={user} />

            {/* Redemption history */}
            <div className="glass-card p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Gift size={16} className="text-amber-500" />
                Redemption History
              </h3>
              {redemptions.length === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-4">No redemptions yet</p>
              ) : (
                <div className="space-y-3">
                  {redemptions.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-2 text-sm">
                      <div>
                        <div className="text-zinc-300 font-medium">{r.rewardName}</div>
                        <div className="text-zinc-600 text-xs mt-0.5">{formatDateTime(r.redeemedAt)}</div>
                      </div>
                      <span className={`badge ${r.status === 'used' ? 'badge-green' : 'badge-gold'} text-xs shrink-0`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm redeem modal */}
      <Modal isOpen={!!redeemTarget} onClose={() => setRedeemTarget(null)} title="Redeem Reward" size="sm">
        {redeemTarget && (
          <div className="text-center">
            <div className="text-4xl mb-3">{redeemTarget.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{redeemTarget.name}</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{redeemTarget.description}</p>
            <p className="text-amber-400 font-medium mb-6">
              This will use {redeemTarget.stamps} of your {user?.stamps} stamps.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRedeemTarget(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={handleRedeem} disabled={isRedeeming} className="btn-gold flex-1 justify-center">
                {isRedeeming ? 'Redeeming...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
