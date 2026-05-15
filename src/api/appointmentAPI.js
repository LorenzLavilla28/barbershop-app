import { mockAppointments } from '../services/mockData'
import { delay } from '../utils/helpers'

export const appointmentAPI = {
  create: async (appointmentData) => {
    await delay(1000)
    const newAppointment = {
      id: `APT-${Date.now()}`,
      ...appointmentData,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
    }
    mockAppointments.unshift(newAppointment)
    return { appointment: newAppointment }
  },

  getByUser: async (userId) => {
    await delay(600)
    const userAppointments = mockAppointments.filter((a) => a.userId === userId)
    return { appointments: userAppointments }
  },

  getAll: async () => {
    await delay(600)
    return { appointments: [...mockAppointments] }
  },

  getById: async (id) => {
    await delay(400)
    const appt = mockAppointments.find((a) => a.id === id)
    if (!appt) throw new Error('Appointment not found')
    return { appointment: appt }
  },

  updateStatus: async (id, status) => {
    await delay(500)
    const idx = mockAppointments.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Appointment not found')
    mockAppointments[idx].status = status
    return { appointment: mockAppointments[idx] }
  },

  cancel: async (id) => {
    await delay(500)
    const idx = mockAppointments.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Appointment not found')
    mockAppointments[idx].status = 'cancelled'
    return { appointment: mockAppointments[idx] }
  },

  uploadPaymentProof: async (id, proofData) => {
    await delay(1200)
    const idx = mockAppointments.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Appointment not found')
    mockAppointments[idx].paymentProof = proofData
    mockAppointments[idx].status = 'payment_submitted'
    return { appointment: mockAppointments[idx] }
  },

  getAvailableSlots: async (barberId, date) => {
    await delay(400)
    const bookedSlots = mockAppointments
      .filter((a) => a.barberId === barberId && a.date === date && a.status !== 'cancelled')
      .map((a) => a.timeSlot)

    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30',
    ]

    return {
      slots: allSlots.map((slot) => ({
        time: slot,
        available: !bookedSlots.includes(slot),
      })),
    }
  },
}
