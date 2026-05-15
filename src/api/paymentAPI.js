import { delay } from '../utils/helpers'

export const GCASH_NUMBER = '0917-123-4567'
export const GCASH_NAME = 'BARBEROS Premium'
export const BANK_ACCOUNT = '0123-4567-89'
export const BANK_NAME = 'BDO Unibank'
export const ACCOUNT_NAME = 'BARBEROS Premium Inc.'

export const paymentAPI = {
  getGCashDetails: async (amount) => {
    await delay(300)
    return {
      number: GCASH_NUMBER,
      name: GCASH_NAME,
      amount,
      reference: `BARB-${Date.now()}`,
    }
  },

  getBankDetails: async (amount) => {
    await delay(300)
    return {
      bankName: BANK_NAME,
      accountNumber: BANK_ACCOUNT,
      accountName: ACCOUNT_NAME,
      amount,
      reference: `BARB-${Date.now()}`,
    }
  },

  submitPaymentProof: async (appointmentId, proofFile, method) => {
    await delay(1500)
    // Simulate file upload — in production, upload to S3/Cloudinary
    return {
      success: true,
      appointmentId,
      method,
      submittedAt: new Date().toISOString(),
      message: 'Payment proof submitted. Awaiting admin verification.',
    }
  },

  verifyPayment: async (appointmentId) => {
    await delay(700)
    return {
      success: true,
      appointmentId,
      verifiedAt: new Date().toISOString(),
      status: 'confirmed',
    }
  },
}
