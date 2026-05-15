import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Download, Copy } from 'lucide-react'
import { generateQRData } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function QRCodeCard({ user }) {
  const qrData = generateQRData(user.membershipId)

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.membershipId)
    toast.success('Membership ID copied!')
  }

  const handleDownload = () => {
    const svg = document.getElementById('loyalty-qr')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#18181b'
      ctx.fillRect(0, 0, 300, 300)
      ctx.drawImage(img, 25, 25, 250, 250)
      const link = document.createElement('a')
      link.download = `barberos-loyalty-${user.membershipId}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    toast.success('QR Code downloaded!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 text-center"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">Loyalty Membership</div>
        <div className="font-serif text-xl font-bold text-white">{user.name}</div>
      </div>

      {/* QR Code */}
      <div className="inline-flex p-4 rounded-2xl bg-white mb-4">
        <QRCodeSVG
          id="loyalty-qr"
          value={qrData}
          size={160}
          level="H"
          includeMargin={false}
          fgColor="#09090b"
          bgColor="#ffffff"
        />
      </div>

      {/* Membership ID */}
      <div className="mb-4">
        <div className="text-xs text-zinc-500 mb-1">Membership ID</div>
        <div className="flex items-center justify-center gap-2">
          <code className="text-amber-400 font-mono font-bold text-lg tracking-widest">
            {user.membershipId}
          </code>
          <button
            onClick={handleCopyId}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-amber-400 transition-colors"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
          <div className="text-amber-400 font-bold text-2xl">{user.stamps || 0}</div>
          <div className="text-zinc-500 text-xs">Loyalty Stamps</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="text-white font-bold text-2xl">{user.totalVisits || 0}</div>
          <div className="text-zinc-500 text-xs">Total Visits</div>
        </div>
      </div>

      <p className="text-zinc-600 text-xs mb-4">
        Show this QR code to your barber after each visit to earn loyalty stamps.
      </p>

      <button onClick={handleDownload} className="btn-outline w-full justify-center text-sm">
        <Download size={14} />
        Download QR Code
      </button>
    </motion.div>
  )
}
