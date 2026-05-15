import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { CalendarDays, Users, DollarSign, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { mockAnalytics, mockAppointments } from '../../services/mockData'
import AnalyticsCards from '../../components/admin/AnalyticsCards'
import AdminTable from '../../components/admin/AdminTable'
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'

const PIE_COLORS = ['#f59e0b', '#d97706', '#92400e', '#78350f', '#451a03', '#1c0a00']

const recentColumns = [
  { key: 'id', label: 'ID', sortable: false },
  { key: 'userName', label: 'Customer', sortable: true },
  { key: 'serviceName', label: 'Service', sortable: true },
  { key: 'barberName', label: 'Barber', sortable: true },
  { key: 'date', label: 'Date', sortable: true, render: (v) => formatDate(v) },
  { key: 'timeSlot', label: 'Time', render: (v) => formatTime(v) },
  {
    key: 'status', label: 'Status', sortable: true,
    render: (v) => <span className={STATUS_COLORS[v]}>{STATUS_LABELS[v] || v}</span>,
  },
  {
    key: 'servicePrice', label: 'Amount', sortable: true,
    render: (v) => <span className="text-amber-400 font-semibold">{formatCurrency(v)}</span>,
  },
]

export default function AdminDashboard() {
  const analytics = mockAnalytics
  const recentAppointments = mockAppointments.slice(0, 8)

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      change: 12.5,
      icon: DollarSign,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Total Bookings',
      value: analytics.totalBookings,
      change: 8.3,
      icon: CalendarDays,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Total Customers',
      value: analytics.totalCustomers,
      change: 5.1,
      icon: Users,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
    },
    {
      label: "Today's Bookings",
      value: analytics.todayBookings,
      icon: TrendingUp,
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-400',
    },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card-dark p-3 text-sm border border-white/10">
          <p className="text-zinc-400 mb-1">{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name !== 'revenue'
                ? entry.value
                : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome back! Here's what's happening at BARBEROS.</p>
      </div>

      {/* Stats */}
      <AnalyticsCards cards={cards} />

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-white font-semibold mb-5">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6, fill: '#fbbf24' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Services pie */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-5">Bookings by Service</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={analytics.bookingsByService}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {analytics.bookingsByService.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {analytics.bookingsByService.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span className="text-zinc-400 truncate flex-1">{item.name}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top barbers */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-5">Top Barbers This Month</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.topBarbers.map((barber, i) => (
            <motion.div
              key={barber.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-amber-700' : 'text-zinc-500'}`}>
                  #{i + 1}
                </span>
              </div>
              <div className="text-white font-medium text-sm truncate">{barber.name}</div>
              <div className="text-zinc-500 text-xs mt-1">{barber.bookings} bookings</div>
              <div className="text-amber-400 font-semibold text-sm mt-0.5">{formatCurrency(barber.revenue)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Recent Appointments</h3>
        </div>
        <AdminTable
          columns={recentColumns}
          data={recentAppointments}
          searchable
          searchPlaceholder="Search appointments..."
        />
      </div>
    </div>
  )
}
