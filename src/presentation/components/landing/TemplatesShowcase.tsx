'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const templates = [
  {
    name: 'Elegant Rose',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop',
    color: '#C8A882'
  },
  {
    name: 'Modern Minimalist',
    category: 'Basic',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop',
    color: '#2D2D2D'
  },
  {
    name: 'Floral Garden',
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop',
    color: '#7B9E87'
  }
]

export function TemplatesShowcase() {
  return (
    <section id="template" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C8A882]/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Desain Template Eksklusif</h2>
            <p className="text-slate-400 text-lg">
              Pilih dari koleksi desain kami yang dibuat secara profesional. Setiap template dapat dikustomisasi agar sesuai dengan tema pernikahan Anda.
            </p>
          </div>
          <Link href="/login" className="inline-flex items-center gap-2 text-[#C8A882] font-medium hover:text-white transition-colors group">
            Lihat Semua Template
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-slate-800"
            >
              <img 
                src={tpl.image} 
                alt={tpl.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${tpl.color}30`, color: tpl.color }}>
                  {tpl.category}
                </div>
                <h3 className="text-2xl font-bold">{tpl.name}</h3>
                
                <div className="mt-6 flex gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100">
                    Preview
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
