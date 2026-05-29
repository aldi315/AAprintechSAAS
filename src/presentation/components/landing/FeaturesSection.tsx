'use client'
import { motion } from 'framer-motion'
import { QrCode, Globe, Image as ImageIcon, Users, BookOpen, Smartphone } from 'lucide-react'

const features = [
  {
    icon: <QrCode className="w-6 h-6" />,
    title: 'Sistem RSVP & QR Code',
    description: 'Tamu mendapatkan kode QR unik untuk check-in buku tamu digital di hari H dengan cepat dan elegan.'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Custom Subdomain',
    description: 'Miliki tautan eksklusif untuk undangan Anda (misal: nama-pasangan.aaprintech.com).'
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: 'Galeri Premium',
    description: 'Tampilkan foto pre-wedding Anda dalam galeri masonry yang memukau dan interaktif.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Manajemen Tamu',
    description: 'Kelola daftar tamu, status kehadiran (Hadir/Tidak), dan ucapan dari tamu dalam satu dashboard cerdas.'
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Kisah Cinta & Acara',
    description: 'Ceritakan perjalanan cinta Anda dan cantumkan detail rangkaian acara secara jelas beserta integrasi peta.'
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'Responsif & Cepat',
    description: 'Tampilan sempurna di semua perangkat (HP, Tablet, Desktop) dengan waktu muat yang sangat cepat.'
  }
]

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Fitur Lengkap untuk Momen Spesial
          </h2>
          <p className="text-lg text-slate-600">
            Kami menyediakan semua alat yang Anda butuhkan untuk membuat undangan digital yang berkesan dan mengelola tamu tanpa stres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-[#C8A882]/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#C8A882] mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
