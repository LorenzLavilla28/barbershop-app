import { mockUsers, generateMembershipId } from '../services/mockData'
import { delay } from '../utils/helpers'

// Simulated JWT token generator
const generateToken = (user) =>
  btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 }))

export const authAPI = {
  login: async (email, password) => {
    await delay(800)
    const user = mockUsers.find((u) => u.email === email)
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password')
    }
    const { password: _, ...safeUser } = user
    const token = generateToken(safeUser)
    return { user: safeUser, token }
  },

  register: async (data) => {
    await delay(1000)
    const exists = mockUsers.find((u) => u.email === data.email)
    if (exists) throw new Error('Email already registered')
    const newUser = {
      id: Date.now(),
      ...data,
      role: 'customer',
      stamps: 0,
      totalVisits: 0,
      membershipId: generateMembershipId(),
      avatar: null,
      createdAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    const { password: _, ...safeUser } = newUser
    const token = generateToken(safeUser)
    return { user: safeUser, token }
  },

  forgotPassword: async (email) => {
    await delay(700)
    const user = mockUsers.find((u) => u.email === email)
    if (!user) throw new Error('No account found with that email')
    return { message: 'Password reset link sent to your email' }
  },

  updateProfile: async (userId, updates) => {
    await delay(600)
    const idx = mockUsers.findIndex((u) => u.id === userId)
    if (idx === -1) throw new Error('User not found')
    Object.assign(mockUsers[idx], updates)
    const { password: _, ...safeUser } = mockUsers[idx]
    return { user: safeUser }
  },
}
