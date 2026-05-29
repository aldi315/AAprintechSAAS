'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Menu, X } from 'lucide-react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#C8A882] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-xl ${isScrolled ? 'text-slate-800' : 'text-slate-800'}`}>
            AAP Wedding
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#fitur" className="text-sm font-medium text-slate-600 hover:text-[#C8A882] transition-colors">
            Fitur
          </Link>
          <Link href="#template" className="text-sm font-medium text-slate-600 hover:text-[#C8A882] transition-colors">
            Template
          </Link>
          <Link href="#harga" className="text-sm font-medium text-slate-600 hover:text-[#C8A882] transition-colors">
            Harga
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-[#C8A882] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium bg-[#0F172A] text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-lg flex flex-col gap-4">
          <Link href="#fitur" className="text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Fitur</Link>
          <Link href="#template" className="text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Template</Link>
          <Link href="#harga" className="text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Harga</Link>
          <hr className="border-slate-100 my-2" />
          <Link href="/login" className="text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
          <Link href="/login" className="bg-[#0F172A] text-white text-center py-3 rounded-xl font-medium" onClick={() => setMobileMenuOpen(false)}>Mulai Gratis</Link>
        </div>
      )}
    </motion.header>
  )
}
