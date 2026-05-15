import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Smartphone, Building2, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { paymentAPI } from '../../api/paymentAPI'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function PaymentModal({ isOpen, onClose, appointment, onPaymentSubmitted }) {
  const [method, setMethod] = useState(null)
  const [step, setStep] = useState('select') // 'select' | 'details' | 'upload' | 'done'
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setUploadedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleSelectMethod = async (selectedMethod) => {
    setMethod(selectedMethod)
    try {
      const details =
        selectedMethod === 'gcash'
          ? await paymentAPI.getGCashDetails(appointment?.servicePrice)
          : await paymentAPI.getBankDetails(appointment?.servicePrice)
      setPaymentDetails(details)
      setStep('details')
    } catch {
      toast.error('Failed to load payment details')
    }
  }

  const handleSubmitProof = async () => {
    if (!uploadedFile) {
      toast.error('Please upload your payment proof')
      return
    }
    setIsSubmitting(true)
    try {
      await paymentAPI.submitPaymentProof(appointment?.id, uploadedFile, method)
      setStep('done')
      toast.success('Payment proof submitted! Admin will verify shortly.')
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDone = () => {
    onPaymentSubmitted?.()
    onClose()
    setStep('select')
    setMethod(null)
    setUploadedFile(null)
    setPaymentDetails(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment" size="md">
      <AnimatePresence mode="wait">

        {/* Step 1: Select method */}
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-zinc-400 text-sm mb-6">
              Amount to pay: <span className="text-amber-400 font-bold text-lg">{formatCurrency(appointment?.servicePrice || 0)}</span>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectMethod('gcash')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <Smartphone size={22} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">GCash</div>
                  <div className="text-zinc-500 text-sm">Pay via GCash QR Code</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectMethod('bank_transfer')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold group-hover:text-emerald-300 transition-colors">Bank Transfer</div>
                  <div className="text-zinc-500 text-sm">Online banking or over-the-counter</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment details */}
        {step === 'details' && paymentDetails && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="text-center mb-6">
              <div className={clsx(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-semibold',
                method === 'gcash' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              )}>
                {method === 'gcash' ? <Smartphone size={16} /> : <Building2 size={16} />}
                {method === 'gcash' ? 'GCash Payment' : 'Bank Transfer'}
              </div>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3 mb-6">
              {method === 'gcash' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">GCash Number</span>
                    <span className="text-white font-mono font-semibold">{paymentDetails.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Account Name</span>
                    <span className="text-white font-semibold">{paymentDetails.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Bank</span>
                    <span className="text-white font-semibold">{paymentDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Account No.</span>
                    <span className="text-white font-mono font-semibold">{paymentDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Account Name</span>
                    <span className="text-white font-semibold">{paymentDetails.accountName}</span>
                  </div>
                </>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-zinc-500 text-sm">Amount</span>
                <span className="text-amber-400 font-bold">{formatCurrency(paymentDetails.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Reference</span>
                <span className="text-white font-mono text-xs">{paymentDetails.reference}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300/80 text-sm">
                After sending payment, upload your proof of payment (screenshot or receipt) on the next step.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="btn-ghost flex-1 justify-center">
                Back
              </button>
              <button onClick={() => setStep('upload')} className="btn-gold flex-1 justify-center">
                I've Paid — Upload Proof
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Upload proof */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-zinc-400 text-sm mb-5">Upload your payment screenshot or receipt to confirm your booking.</p>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={clsx(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5',
                isDragActive
                  ? 'border-amber-500 bg-amber-500/10'
                  : uploadedFile
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-white/20 hover:border-amber-500/50 hover:bg-amber-500/5'
              )}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div>
                  <CheckCircle2 size={40} className="text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-medium">{uploadedFile.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
                    className="mt-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors mx-auto"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={36} className="text-zinc-500 mx-auto mb-3" />
                  <p className="text-white font-medium">Drop your screenshot here</p>
                  <p className="text-zinc-500 text-sm mt-1">or click to browse files</p>
                  <p className="text-zinc-600 text-xs mt-2">JPG, PNG, WEBP · Max 5MB</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="btn-ghost flex-1 justify-center">
                Back
              </button>
              <button
                onClick={handleSubmitProof}
                disabled={isSubmitting || !uploadedFile}
                className="btn-gold flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Done */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 size={40} className="text-amber-400" />
            </motion.div>
            <h3 className="text-white font-semibold text-xl mb-2">Payment Submitted!</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Your proof of payment has been submitted. Our admin will verify your payment and confirm your booking shortly. You'll receive a notification once confirmed.
            </p>
            <button onClick={handleDone} className="btn-gold w-full justify-center">
              View My Appointments
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </Modal>
  )
}
