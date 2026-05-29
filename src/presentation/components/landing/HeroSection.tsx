'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#FDFAF6] -z-20" />
      <div className="absolute top-0 right-0 w-1/2 h-[800px] bg-gradient-to-bl from-[#C8A882]/10 via-transparent to-transparent -z-10 rounded-bl-[100px]" />
      <div className="absolute bottom-0 left-0 w-1/2 h-[500px] bg-gradient-to-tr from-[#0F172A]/5 via-transparent to-transparent -z-10 rounded-tr-[100px]" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-[#C8A882]/30 text-[#8B6F47] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Platform Undangan Digital Premium</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] mb-6">
              Buat Undangan Pernikahan <span className="text-[#C8A882]">Elegan</span> dalam Hitungan Menit
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Tingkatkan pengalaman tamu Anda dengan undangan digital interaktif, manajemen RSVP yang cerdas, dan desain premium yang merefleksikan kisah cinta Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-[#0F172A] text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 group"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#template" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 rounded-full font-medium hover:bg-slate-50 transition-all border border-slate-200 text-center"
              >
                Lihat Template
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">10k+</span>
                <span className="text-sm text-slate-600">Pasangan Bahagia</span>
              </div>
              <div className="w-px h-12 bg-slate-300" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">50+</span>
                <span className="text-sm text-slate-600">Template Premium</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            className="flex-1 relative w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Dekorasi Abstract */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C8A882]/10 rounded-full blur-3xl -z-10" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border-8 border-white bg-white">
              {/* Fallback image from unsplash */}
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="Wedding couple" 
                className="w-full h-auto object-cover rounded-2xl"
              />
              
              {/* Floating Element */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                  🎉
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Budi Santoso</p>
                  <p className="text-xs text-slate-500">Baru saja RSVP Hadir</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
