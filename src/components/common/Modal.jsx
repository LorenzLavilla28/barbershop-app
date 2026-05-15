import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeClasses[size]} glass-card-dark shadow-2xl max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className={title ? 'p-6' : 'p-6'}>
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
