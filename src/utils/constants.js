export const APP_NAME = 'BARBEROS'
export const APP_TAGLINE = 'Premium Grooming Experience'

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  BARBERS: '/barbers',
  BOOKING: '/booking',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  REWARDS: '/rewards',
  APPOINTMENTS: '/appointments',
  ADMIN: '/admin',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_BARBERS: '/admin/barbers',
  ADMIN_REWARDS: '/admin/rewards',
  ADMIN_USERS: '/admin/users',
}

export const BOOKING_STEPS = [
  { step: 1, label: 'Service' },
  { step: 2, label: 'Barber' },
  { step: 3, label: 'Schedule' },
  { step: 4, label: 'Payment' },
  { step: 5, label: 'Confirmed' },
]

export const APPOINTMENT_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_SUBMITTED: 'payment_submitted',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  payment_submitted: 'Payment Submitted',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS = {
  pending_payment: 'badge-zinc',
  payment_submitted: 'badge-blue',
  confirmed: 'badge-green',
  completed: 'badge-gold',
  cancelled: 'badge-red',
}

export const PAYMENT_METHODS = {
  GCASH: 'gcash',
  BANK_TRANSFER: 'bank_transfer',
}

export const SERVICE_CATEGORIES = [
  { value: 'all', label: 'All Services' },
  { value: 'hair', label: 'Hair' },
  { value: 'beard', label: 'Beard' },
  { value: 'skin', label: 'Skin' },
  { value: 'shave', label: 'Shave' },
]

export const MAX_STAMPS_DISPLAY = 20
