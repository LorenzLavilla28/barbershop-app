import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-950 via-stone-950 to-dark-900">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-lg">B</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-widest text-white">BARBEROS</span>
          </Link>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              The Modern<br />
              <span className="gold-gradient-text">Gentleman's</span><br />
              Experience.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Book appointments, earn loyalty stamps, and enjoy premium grooming services tailored for the discerning modern man.
            </p>

            <div className="mt-8 flex gap-6">
              {[
                { label: '500+', desc: 'Happy Clients' },
                { label: '4.9★', desc: 'Average Rating' },
                { label: '4', desc: 'Expert Barbers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-amber-400 font-bold text-xl">{stat.label}</div>
                  <div className="text-zinc-500 text-sm">{stat.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-zinc-600 text-sm">© 2026 BARBEROS Premium. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold">B</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-white">BARBEROS</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
