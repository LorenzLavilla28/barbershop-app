import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle2, ArrowRight, ArrowLeft, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'

import BookingSteps from '../components/booking/BookingSteps'
import BookingCalendar from '../components/booking/BookingCalendar'
import TimeSlotPicker from '../components/booking/TimeSlotPicker'
import PaymentModal from '../components/payment/PaymentModal'
import ServiceCard from '../components/cards/ServiceCard'
import BarberCard from '../components/cards/BarberCard'

import useBookingStore from '../store/bookingStore'
import useAuthStore from '../store/authStore'
import { serviceAPI } from '../api/serviceAPI'
import { barberAPI } from '../api/barberAPI'
import { appointmentAPI } from '../api/appointmentAPI'
import { formatCurrency, formatDate, formatTime } from '../utils/helpers'

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    step, nextStep, prevStep,
    selectedService, selectedBarber, selectedDate, selectedTimeSlot,
    selectService, selectBarber, selectDate, selectTimeSlot,
    canProceed, isSubmitting, setSubmitting, setConfirmedBooking, confirmedBooking, resetBooking,
  } = useBookingStore()

  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [createdAppointment, setCreatedAppointment] = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Load data
  useEffect(() => {
    serviceAPI.getAll().then(({ services }) => setServices(services))
    barberAPI.getAll().then(({ barbers }) => setBarbers(barbers))
  }, [])

  // Pre-select from navigation state
  useEffect(() => {
    if (location.state?.serviceId) {
      const svc = services.find((s) => s.id === location.state.serviceId)
      if (svc) selectService(svc)
    }
    if (location.state?.barberId) {
      const brb = barbers.find((b) => b.id === location.state.barberId)
      if (brb) selectBarber(brb)
    }
  }, [location.state, services, barbers])

  // Load time slots when date + barber selected
  useEffect(() => {
    if (selectedDate && selectedBarber) {
      setSlotsLoading(true)
      appointmentAPI
        .getAvailableSlots(selectedBarber.id, format(selectedDate, 'yyyy-MM-dd'))
        .then(({ slots }) => setTimeSlots(slots))
        .finally(() => setSlotsLoading(false))
    }
  }, [selectedDate, selectedBarber])

  const handleCreateBooking = async () => {
    setSubmitting(true)
    try {
      const { appointment } = await appointmentAPI.create({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTimeSlot,
      })
      setCreatedAppointment(appointment)
      setConfirmedBooking(appointment)
      nextStep()
      toast.success('Appointment created! Complete payment to confirm.')
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentDone = () => {
    setIsPaymentOpen(false)
    toast.success('Booking complete! We\'ll confirm once payment is verified.')
  }

  const handleNewBooking = () => {
    resetBooking()
    navigate('/booking')
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="section-heading mb-2">Book Your Appointment</h1>
          <p className="text-zinc-400">Follow the steps below to secure your grooming session.</p>
        </div>

        <BookingSteps currentStep={step} />

        <AnimatePresence mode="wait">
          {/* ─── Step 1: Service ─────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Choose Your Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => selectService(s)}
                    className={`cursor-pointer transition-all rounded-2xl ${
                      selectedService?.id === s.id ? 'ring-2 ring-amber-500 scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <ServiceCard service={s} index={i} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Barber ──────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Choose Your Barber</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {barbers.map((b, i) => (
                  <div
                    key={b.id}
                    onClick={() => selectBarber(b)}
                    className={`cursor-pointer transition-all rounded-2xl ${
                      selectedBarber?.id === b.id ? 'ring-2 ring-amber-500 scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <BarberCard barber={b} index={i} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Date & Time ─────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Choose Date & Time</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <BookingCalendar selectedDate={selectedDate} onSelectDate={selectDate} />
                {slotsLoading ? (
                  <div className="glass-card p-8 flex items-center justify-center">
                    <div className="text-zinc-500 text-sm">Loading slots...</div>
                  </div>
                ) : (
                  <TimeSlotPicker slots={timeSlots} selectedSlot={selectedTimeSlot} onSelect={selectTimeSlot} />
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: Review & Pay ────────────────────── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Review & Pay</h2>
              <div className="max-w-lg mx-auto">
                <div className="glass-card p-6 mb-6">
                  <h3 className="text-white font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Service', value: selectedService?.name },
                      { label: 'Barber', value: selectedBarber?.name },
                      { label: 'Date', value: selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '' },
                      { label: 'Time', value: selectedTimeSlot ? formatTime(selectedTimeSlot) : '' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-zinc-500">{label}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-zinc-400 font-medium">Total</span>
                      <span className="text-amber-400 font-bold text-lg">{formatCurrency(selectedService?.price || 0)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateBooking}
                  disabled={isSubmitting}
                  className="btn-gold w-full justify-center text-base py-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Booking...' : 'Confirm & Pay'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Step 5: Confirmed ───────────────────────── */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={48} className="text-amber-400" />
              </motion.div>

              <h2 className="font-serif text-3xl font-bold text-white mb-3">Booking Created!</h2>
              <p className="text-zinc-400 mb-2">
                Your appointment <strong className="text-white">#{confirmedBooking?.id}</strong> has been created.
              </p>
              <p className="text-zinc-400 text-sm mb-8">
                Complete your payment to confirm your slot. Your booking will be confirmed once payment is verified.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="btn-gold w-full justify-center text-base py-4"
                >
                  Complete Payment Now
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/appointments')} className="btn-outline w-full justify-center">
                  View My Appointments
                </button>
                <button onClick={handleNewBooking} className="btn-ghost w-full justify-center text-sm">
                  Book Another Appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            {step < 4 && (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        appointment={createdAppointment || confirmedBooking}
        onPaymentSubmitted={handlePaymentDone}
      />
    </div>
  )
}
