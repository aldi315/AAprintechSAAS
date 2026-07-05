'use client'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 'Rp 0',
    description: 'Cocok untuk pernikahan skala kecil.',
    features: [
      '1 Tema Basic',
      'Maksimal 50 Tamu',
      'Manajemen RSVP',
      'URL aaprintech.com/nama',
      'Watermark AAP'
    ],
    highlight: false,
    btnText: 'Mulai Gratis',
  },
  {
    name: 'Premium',
    price: 'Rp 149rb',
    description: 'Fitur lengkap untuk momen sempurna.',
    features: [
      'Akses Semua Tema Premium',
      'Tamu Tidak Terbatas',
      'Galeri Foto & Video',
      'Custom Subdomain',
      'QR Code Check-in',
      'Tanpa Watermark'
    ],
    highlight: true,
    btnText: 'Pilih Premium',
  },
  {
    name: 'Reseller / Vendor',
    price: 'Hubungi Kami',
    description: 'Untuk bisnis undangan & Event Organizer.',
    features: [
      'Buat Undangan Tanpa Batas',
      'White-label (Logo Sendiri)',
      'Custom Domain Sendiri',
      'Manajemen Klien',
      'Prioritas Dukungan 24/7'
    ],
    highlight: false,
    btnText: 'Hubungi Sales',
  }
]

export function PricingSection() {
  return (
    <section id="harga" className="py-24 bg-[#FDFAF6]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Harga Transparan, Tanpa Biaya Tersembunyi
          </h2>
          <p className="text-lg text-slate-600">
            Pilih paket yang paling sesuai dengan kebutuhan pernikahan atau bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-8 ${
                plan.highlight 
                  ? 'bg-[#0F172A] text-white shadow-2xl scale-100 md:scale-105 border-none' 
                  : 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100'
              }`}
            >
              {plan.highlight && (
                <div className="text-[#C8A882] text-sm font-bold tracking-wider uppercase mb-4">
                  Paling Populer
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.highlight ? 'text-slate-400' : 'text-slate-500'}>
                {plan.description}
              </p>
              <div className="my-8">
                <span className="text-4xl font-extrabold">{plan.price}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${plan.highlight ? 'text-[#C8A882]' : 'text-[#C8A882]'}`} />
                    <span className={plan.highlight ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/login"
                className={`block w-full text-center py-3 rounded-full font-bold transition-all ${
                  plan.highlight
                    ? 'bg-[#C8A882] text-white hover:bg-[#b89872]'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.btnText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
