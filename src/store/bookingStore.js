import { create } from 'zustand'

const useBookingStore = create((set, get) => ({
  // Wizard step (1-5)
  step: 1,

  // Selections
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTimeSlot: null,

  // Payment
  paymentMethod: null, // 'gcash' | 'bank_transfer'
  paymentProof: null,

  // Booking result
  confirmedBooking: null,

  // UI state
  isSubmitting: false,

  // Step navigation
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  goToStep: (step) => set({ step }),

  // Setters
  selectService: (service) => set({ selectedService: service }),
  selectBarber: (barber) => set({ selectedBarber: barber }),
  selectDate: (date) => set({ selectedDate: date, selectedTimeSlot: null }),
  selectTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setPaymentProof: (proof) => set({ paymentProof: proof }),
  setConfirmedBooking: (booking) => set({ confirmedBooking: booking }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  // Reset entire booking flow
  resetBooking: () =>
    set({
      step: 1,
      selectedService: null,
      selectedBarber: null,
      selectedDate: null,
      selectedTimeSlot: null,
      paymentMethod: null,
      paymentProof: null,
      confirmedBooking: null,
      isSubmitting: false,
    }),

  // Check if step is valid to proceed
  canProceed: () => {
    const { step, selectedService, selectedBarber, selectedDate, selectedTimeSlot, paymentMethod } = get()
    switch (step) {
      case 1: return !!selectedService
      case 2: return !!selectedBarber
      case 3: return !!selectedDate && !!selectedTimeSlot
      case 4: return !!paymentMethod
      default: return true
    }
  },
}))

export default useBookingStore
