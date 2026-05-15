import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Scissors } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8"
        >
          <Scissors size={40} className="text-amber-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-8xl font-bold gold-gradient-text mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-white mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-500 mb-8 max-w-sm mx-auto"
        >
          This page seems to have gotten a haircut and disappeared. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="btn-gold">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
