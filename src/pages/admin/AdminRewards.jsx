import { useEffect, useState } from 'react'
import { Plus, Edit2, QrCode, CheckCircle2 } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/common/Modal'
import { rewardAPI } from '../../api/rewardAPI'
import { mockUsers } from '../../services/mockData'
import { formatCurrency, formatDateTime, getInitials } from '../../utils/helpers'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function AdminRewards() {
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editTarget, setEditTarget] = useState(null)
  const [stampModalOpen, setStampModalOpen] = useState(false)
  const [membershipInput, setMembershipInput] = useState('')
  const [isAddingStamp, setIsAddingStamp] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { addStamp } = useAuthStore()

  useEffect(() => {
    Promise.all([rewardAPI.getAll(), rewardAPI.getAllRedemptions()])
      .then(([{ rewards }, { redemptions }]) => { setRewards(rewards); setRedemptions(redemptions) })
      .finally(() => setIsLoading(false))
  }, [])

  const handleUpdateReward = async () => {
    if (!editTarget) return
    setIsSaving(true)
    try {
      const { reward } = await rewardAPI.update(editTarget.id, {
        stamps: Number(editTarget.stamps),
        name: editTarget.name,
        description: editTarget.description,
      })
      setRewards((prev) => prev.map((r) => r.id === reward.id ? reward : r))
      setEditTarget(null)
      toast.success('Reward updated!')
    } catch {
      toast.error('Failed to update reward')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddStamp = async () => {
    if (!membershipInput.trim()) { toast.error('Enter a membership ID'); return }
    setIsAddingStamp(true)
    try {
      const user = mockUsers.find((u) => u.membershipId === membershipInput.trim().toUpperCase())
      if (!user) throw new Error('Membership ID not found')
      user.stamps = (user.stamps || 0) + 1
      user.totalVisits = (user.totalVisits || 0) + 1
      addStamp()
      toast.success(`Stamp added for ${user.name}! Total: ${user.stamps} stamps`)
      setMembershipInput('')
      setStampModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to add stamp')
    } finally {
      setIsAddingStamp(false)
    }
  }

  const handleApproveRedemption = async (id) => {
    try {
      await rewardAPI.approveRedemption(id)
      setRedemptions((prev) => prev.map((r) => r.id === id ? { ...r, status: 'used' } : r))
      toast.success('Redemption approved!')
    } catch {
      toast.error('Failed to approve redemption')
    }
  }

  const rewardColumns = [
    { key: 'icon', label: '', render: (v) => <span className="text-2xl">{v}</span> },
    { key: 'stamps', label: 'Stamps Required', sortable: true, render: (v) => <span className="text-amber-400 font-bold">{v}</span> },
    { key: 'name', label: 'Reward', sortable: true, render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'type', label: 'Type', render: (v) => <span className="capitalize badge-zinc badge text-xs">{v}</span> },
    { key: 'value', label: 'Value', render: (v) => <span className="text-emerald-400">{formatCurrency(v)}</span> },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <button onClick={() => setEditTarget({ ...row })} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
          <Edit2 size={14} />
        </button>
      ),
    },
  ]

  const redemptionColumns = [
    { key: 'id', label: 'ID' },
    { key: 'rewardName', label: 'Reward', render: (v) => <span className="text-white font-medium">{v}</span> },
    { key: 'redeemedAt', label: 'Redeemed At', sortable: true, render: (v) => formatDateTime(v) },
    { key: 'status', label: 'Status', render: (v) => <span className={v === 'used' ? 'badge-green' : 'badge-gold'}>{v}</span> },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => row.status === 'pending' ? (
        <button
          onClick={() => handleApproveRedemption(row.id)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
        >
          <CheckCircle2 size={13} /> Approve
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Loyalty & Rewards</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage loyalty milestones and scan member QR codes</p>
        </div>
        <button onClick={() => setStampModalOpen(true)} className="btn-gold text-sm">
          <QrCode size={16} /> Add Stamp to Member
        </button>
      </div>

      {/* Rewards config */}
      <div>
        <h2 className="text-white font-semibold mb-4">Reward Milestones</h2>
        <AdminTable columns={rewardColumns} data={rewards} isLoading={isLoading} emptyMessage="No rewards configured" />
      </div>

      {/* Redemptions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Redemption History</h2>
        <AdminTable columns={redemptionColumns} data={redemptions} emptyMessage="No redemptions yet" searchable />
      </div>

      {/* Add Stamp Modal */}
      <Modal isOpen={stampModalOpen} onClose={() => { setStampModalOpen(false); setMembershipInput('') }} title="Add Loyalty Stamp">
        <div className="space-y-5">
          <p className="text-zinc-400 text-sm">
            Scan the customer's QR code or enter their Membership ID manually to add a loyalty stamp.
          </p>
          <div>
            <label className="label-dark">Membership ID</label>
            <input
              value={membershipInput}
              onChange={(e) => setMembershipInput(e.target.value.toUpperCase())}
              placeholder="e.g. BRB-JDC001"
              className="input-dark font-mono tracking-wider uppercase"
              onKeyDown={(e) => e.key === 'Enter' && handleAddStamp()}
            />
          </div>
          {membershipInput && (
            <div className="text-xs text-zinc-500">
              Looking up: <span className="text-amber-400 font-mono">{membershipInput}</span>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setStampModalOpen(false); setMembershipInput('') }} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleAddStamp} disabled={isAddingStamp || !membershipInput} className="btn-gold flex-1 justify-center">
              <CheckCircle2 size={15} />
              {isAddingStamp ? 'Adding...' : 'Add Stamp'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Reward Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Reward" size="sm">
        {editTarget && (
          <div className="space-y-4">
            <div>
              <label className="label-dark">Reward Name</label>
              <input value={editTarget.name} onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Stamps Required</label>
              <input type="number" value={editTarget.stamps} onChange={(e) => setEditTarget({ ...editTarget, stamps: e.target.value })} className="input-dark" min={1} />
            </div>
            <div>
              <label className="label-dark">Description</label>
              <textarea value={editTarget.description} onChange={(e) => setEditTarget({ ...editTarget, description: e.target.value })} rows={2} className="input-dark resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditTarget(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={handleUpdateReward} disabled={isSaving} className="btn-gold flex-1 justify-center">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
