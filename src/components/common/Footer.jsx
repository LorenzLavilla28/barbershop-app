import { Link } from 'react-router-dom'
import { Scissors, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <Scissors size={18} className="text-black" />
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-white">BARBEROS</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Premium barbershop experience for the modern gentleman. Book appointments, earn rewards, and look your best.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/barbers', label: 'Our Barbers' },
                { to: '/booking', label: 'Book Appointment' },
                { to: '/rewards', label: 'Loyalty Rewards' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-zinc-500 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-2.5">
              {['Classic Haircut', 'Beard Trim & Shape', 'Hair Coloring', 'Luxury Facial', 'Hot Towel Shave', 'Hair Treatment'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-zinc-500 hover:text-amber-400 text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: '123 Gentleman St., BGC, Taguig City, Metro Manila' },
                { icon: Phone, text: '+63 917 123 4567' },
                { icon: Mail, text: 'hello@barberos.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-500 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-zinc-500 mb-1">Operating Hours</div>
              <div className="text-sm text-white font-medium">Mon – Sat: 9:00 AM – 8:00 PM</div>
              <div className="text-sm text-zinc-400">Sunday: 10:00 AM – 6:00 PM</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">© 2026 BARBEROS Premium. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
