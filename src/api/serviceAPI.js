import { mockServices } from '../services/mockData'
import { delay } from '../utils/helpers'

export const serviceAPI = {
  getAll: async () => {
    await delay(500)
    return { services: mockServices.filter((s) => s.available) }
  },

  getAllAdmin: async () => {
    await delay(500)
    return { services: [...mockServices] }
  },

  getById: async (id) => {
    await delay(300)
    const service = mockServices.find((s) => s.id === id)
    if (!service) throw new Error('Service not found')
    return { service }
  },

  create: async (data) => {
    await delay(700)
    const newService = { id: Date.now(), ...data, available: true, createdAt: new Date().toISOString() }
    mockServices.push(newService)
    return { service: newService }
  },

  update: async (id, data) => {
    await delay(500)
    const idx = mockServices.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Service not found')
    Object.assign(mockServices[idx], data)
    return { service: mockServices[idx] }
  },

  delete: async (id) => {
    await delay(500)
    const idx = mockServices.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Service not found')
    mockServices.splice(idx, 1)
    return { message: 'Service deleted' }
  },

  toggleAvailability: async (id) => {
    await delay(300)
    const idx = mockServices.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Service not found')
    mockServices[idx].available = !mockServices[idx].available
    return { service: mockServices[idx] }
  },
}
