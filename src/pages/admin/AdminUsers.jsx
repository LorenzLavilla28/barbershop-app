import { useState } from 'react'
import { Eye, UserCheck, UserX } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import Modal from '../../components/common/Modal'
import { mockUsers } from '../../services/mockData'
import { formatDate, getInitials } from '../../utils/helpers'

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null)
  const customers = mockUsers.filter((u) => u.role !== 'admin')

  const columns = [
    {
      key: 'avatar', label: '',
      render: (v, row) => v
        ? <img src={v} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-white/20" />
        : <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">{getInitials(row.name)}</div>,
    },
    { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="font-medium text-white">{v}</span> },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'membershipId', label: 'Membership ID', render: (v) => <code className="text-amber-400 text-xs font-mono">{v}</code> },
    {
      key: 'stamps', label: 'Stamps',
      render: (v) => <span className="text-amber-400 font-bold">{v || 0}</span>,
    },
    {
      key: 'totalVisits', label: 'Visits',
      render: (v) => <span className="text-white">{v || 0}</span>,
    },
    {
      key: 'createdAt', label: 'Joined',
      render: (v) => <span className="text-zinc-500 text-xs">{formatDate(v)}</span>,
    },
    {
      key: 'id', label: 'Actions',
      render: (_, row) => (
        <button onClick={() => setSelectedUser(row)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
          <Eye size={14} />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-zinc-500 text-sm mt-1">View and manage registered customer accounts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Total Stamps Issued', value: customers.reduce((s, u) => s + (u.stamps || 0), 0) },
          { label: 'Total Visits', value: customers.reduce((s, u) => s + (u.totalVisits || 0), 0) },
          { label: 'Avg Stamps / Customer', value: (customers.reduce((s, u) => s + (u.stamps || 0), 0) / (customers.length || 1)).toFixed(1) },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="text-2xl font-bold text-amber-400">{s.value}</div>
            <div className="text-zinc-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={customers}
        searchable
        searchPlaceholder="Search customers..."
        emptyMessage="No customers found"
      />

      {/* Customer detail modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Customer Details" size="sm">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/30" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
                  {getInitials(selectedUser.name)}
                </div>
              )}
              <div>
                <h3 className="text-white font-semibold text-lg">{selectedUser.name}</h3>
                <p className="text-zinc-500 text-sm">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Membership ID', value: selectedUser.membershipId },
                { label: 'Loyalty Stamps', value: `${selectedUser.stamps || 0} stamps` },
                { label: 'Total Visits', value: `${selectedUser.totalVisits || 0} visits` },
                { label: 'Member Since', value: formatDate(selectedUser.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-2">
                  <span className="text-zinc-500">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
