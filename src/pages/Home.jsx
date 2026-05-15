import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scissors, Star, Shield, Award, ArrowRight, ChevronRight, Calendar } from 'lucide-react'
import { serviceAPI } from '../api/serviceAPI'
import { barberAPI } from '../api/barberAPI'
import { useState } from 'react'
import ServiceCard from '../components/cards/ServiceCard'
import BarberCard from '../components/cards/BarberCard'
import useAuthStore from '../store/authStore'

const stats = [
  { label: 'Happy Clients', value: '2,500+' },
  { label: 'Expert Barbers', value: '4' },
  { label: 'Avg. Rating', value: '4.9★' },
  { label: 'Years Open', value: '8+' },
]

const features = [
  {
    icon: Calendar,
    title: 'Easy Online Booking',
    desc: 'Book your appointment in minutes. Choose your service, barber, date, and time — all from your phone.',
  },
  {
    icon: Award,
    title: 'Loyalty Rewards',
    desc: 'Earn stamps with every visit. Redeem them for free services and premium packages.',
  },
  {
    icon: Shield,
    title: 'Secure Online Payment',
    desc: 'Pay safely via GCash or bank transfer. Your transactions are always protected.',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    desc: 'Expert barbers, quality products, and a relaxing atmosphere designed for the modern gentleman.',
  },
]

export default function Home() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    serviceAPI.getAll().then(({ services }) => setServices(services.slice(0, 3)))
    barberAPI.getAll().then(({ barbers }) => setBarbers(barbers.slice(0, 3)))
  }, [])

  const handleBookService = (service) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate('/booking', { state: { serviceId: service.id } })
  }

  const handleBookBarber = (barber) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate('/booking', { state: { barberId: barber.id } })
  }

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient art */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-stone-950 to-dark-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-900/20 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-stone-800/30 rounded-full blur-[80px] translate-x-1/3 translate-y-1/4" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8"
            >
              <Scissors size={14} />
              Premium Barbershop Experience
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6"
            >
              The Art of
              <span className="block gold-gradient-text">The Perfect</span>
              <span className="block">Cut.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Experience premium grooming where tradition meets modernity. Book your appointment, earn loyalty rewards, and look your absolute best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={isAuthenticated ? '/booking' : '/register'} className="btn-gold text-base px-8 py-4 w-full sm:w-auto justify-center">
                Book Your Appointment
                <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-outline text-base px-8 py-4 w-full sm:w-auto justify-center">
                View Services
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card text-center py-5 px-4">
                <div className="text-amber-400 font-bold text-2xl md:text-3xl font-serif">{stat.value}</div>
                <div className="text-zinc-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-zinc-600 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-amber-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Services ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">What We Offer</div>
              <h2 className="section-heading">Premium Services</h2>
              <p className="section-subheading">Expertly crafted grooming services for the modern gentleman.</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
              All Services <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} onBook={handleBookService} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/services" className="btn-outline">View All Services <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Why Choose Us</div>
            <h2 className="section-heading">The BARBEROS Difference</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <f.icon size={26} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Barbers ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Our Team</div>
              <h2 className="section-heading">Meet the Barberos</h2>
              <p className="section-subheading">Expert craftsmen dedicated to making you look and feel your best.</p>
            </div>
            <Link to="/barbers" className="hidden md:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
              All Barbers <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((b, i) => (
              <BarberCard key={b.id} barber={b} index={i} onBook={handleBookBarber} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Loyalty Section ───────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-10 lg:p-14">
                <div className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-4">Loyalty Program</div>
                <h2 className="font-serif text-4xl font-bold text-white mb-4 leading-tight">
                  Earn Stamps,<br />
                  <span className="gold-gradient-text">Unlock Rewards</span>
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed mb-8">
                  Join the BARBEROS loyalty program and earn a stamp with every visit. Redeem your stamps for free services and exclusive premium packages.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { stamps: 5, reward: 'Free Classic Haircut', icon: '✂️' },
                    { stamps: 10, reward: 'Free Luxury Facial', icon: '✨' },
                    { stamps: 15, reward: 'Premium Grooming Package', icon: '👑' },
                  ].map((item) => (
                    <div key={item.stamps} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-amber-400 font-semibold text-sm">{item.stamps} stamps</span>
                        <span className="text-zinc-500 text-sm"> → {item.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to={isAuthenticated ? '/rewards' : '/register'} className="btn-gold">
                  {isAuthenticated ? 'View My Rewards' : 'Join & Start Earning'}
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right — visual */}
              <div className="relative bg-gradient-to-br from-amber-900/20 to-dark-900 p-10 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-3 w-full max-w-xs">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, type: 'spring' }}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl border ${
                        i < 7
                          ? 'bg-amber-500/20 border-amber-500/40'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {i < 7 ? '✂️' : <span className="w-2 h-2 rounded-full border border-white/20" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-5">
              Ready for Your Best<br />
              <span className="gold-gradient-text">Look Yet?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Book your appointment today and experience the BARBEROS premium grooming experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/booking' : '/register'} className="btn-gold text-base px-10 py-4 w-full sm:w-auto justify-center">
                Book Now <ArrowRight size={18} />
              </Link>
              <Link to="/barbers" className="btn-ghost text-base w-full sm:w-auto justify-center">
                Meet Our Barbers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
