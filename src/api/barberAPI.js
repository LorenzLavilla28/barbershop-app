import { mockBarbers } from '../services/mockData'
import { delay } from '../utils/helpers'

export const barberAPI = {
  getAll: async () => {
    await delay(500)
    return { barbers: mockBarbers.filter((b) => b.active) }
  },

  getAllAdmin: async () => {
    await delay(500)
    return { barbers: [...mockBarbers] }
  },

  getById: async (id) => {
    await delay(300)
    const barber = mockBarbers.find((b) => b.id === id)
    if (!barber) throw new Error('Barber not found')
    return { barber }
  },

  create: async (data) => {
    await delay(700)
    const newBarber = { id: Date.now(), ...data, active: true, rating: 5.0, reviewCount: 0, createdAt: new Date().toISOString() }
    mockBarbers.push(newBarber)
    return { barber: newBarber }
  },

  update: async (id, data) => {
    await delay(500)
    const idx = mockBarbers.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error('Barber not found')
    Object.assign(mockBarbers[idx], data)
    return { barber: mockBarbers[idx] }
  },

  toggleActive: async (id) => {
    await delay(300)
    const idx = mockBarbers.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error('Barber not found')
    mockBarbers[idx].active = !mockBarbers[idx].active
    return { barber: mockBarbers[idx] }
  },
}
