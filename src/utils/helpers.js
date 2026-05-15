import { format, parseISO, isToday, isFuture, isPast } from 'date-fns'

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy h:mm a')
  } catch {
    return dateStr
  }
}

export const formatTime = (timeStr) => {
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const date = new Date()
    date.setHours(h, m)
    return format(date, 'h:mm a')
  } catch {
    return timeStr
  }
}

export const isAppointmentUpcoming = (date) => {
  try {
    return isFuture(parseISO(date)) || isToday(parseISO(date))
  } catch {
    return false
  }
}

export const isAppointmentPast = (date) => {
  try {
    return isPast(parseISO(date)) && !isToday(parseISO(date))
  } catch {
    return false
  }
}

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export const truncate = (str, len = 100) =>
  str && str.length > len ? `${str.slice(0, len)}...` : str

export const generateQRData = (membershipId) =>
  JSON.stringify({ type: 'barberos_loyalty', memberId: membershipId, version: '1.0' })

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const getStampProgress = (stamps, rewardStamps) => {
  const progress = (stamps % rewardStamps) / rewardStamps
  return Math.min(progress, 1)
}

export const getNextReward = (stamps, rewards) => {
  const sorted = [...rewards].sort((a, b) => a.stamps - b.stamps)
  return sorted.find((r) => r.stamps > stamps) || null
}

export const canRedeemReward = (userStamps, rewardStamps) => userStamps >= rewardStamps

export const dayLabel = (day) => {
  const days = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' }
  return days[day] || day
}
