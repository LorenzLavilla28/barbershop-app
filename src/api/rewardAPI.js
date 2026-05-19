import { mockRewards, mockRedemptions } from '../services/mockData'
import { delay } from '../utils/helpers'

export const rewardAPI = {
  getAll: async () => {
    await delay(400)
    return { rewards: [...mockRewards] }
  },

  redeem: async (userId, rewardId) => {
    await delay(800)
    const reward = mockRewards.find((r) => r.id === rewardId)
    if (!reward) throw new Error('Reward not found')
    const redemption = {
      id: `RDM-${Date.now()}`,
      userId,
      rewardId,
      rewardName: reward.name,
      redeemedAt: new Date().toISOString(),
      status: 'pending',
    }
    mockRedemptions.push(redemption)
    return { redemption }
  },

  getUserRedemptions: async (userId) => {
    await delay(400)
    const redemptions = mockRedemptions.filter((r) => r.userId === userId)
    return { redemptions }
  },

  getAllRedemptions: async () => {
    await delay(400)
    return { redemptions: [...mockRedemptions] }
  },

  addStamp: async (membershipId) => {
    await delay(600)
    return { message: 'Stamp added successfully', membershipId }
  },

  update: async (id, data) => {
    await delay(500)
    const idx = mockRewards.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Reward not found')
    Object.assign(mockRewards[idx], data)
    return { reward: mockRewards[idx] }
  },

  approveRedemption: async (redemptionId) => {
    await delay(400)
    const idx = mockRedemptions.findIndex((r) => r.id === redemptionId)
    if (idx === -1) throw new Error('Redemption not found')
    mockRedemptions[idx].status = 'used'
    return { redemption: mockRedemptions[idx] }
  },
}
