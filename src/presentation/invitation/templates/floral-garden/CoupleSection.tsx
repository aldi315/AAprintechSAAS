'use client'
/**
 * CoupleSection — Profil singkat pasangan pengantin.
 * Animated with Framer Motion stagger.
 */
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/presentation/invitation/components/animations/presets'
import { FadeInView } from '@/presentation/invitation/components/animations/FadeInView'
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function CoupleSection({ data, props }: SectionComponentProps) {
  const brideName = (props.brideName as string) || data.brideName
  const groomName = (props.groomName as string) || data.groomName
  const brideDesc = (props.brideDesc as string) || 'Putri dari Bapak & Ibu'
  const groomDesc = (props.groomDesc as string) || 'Putra dari Bapak & Ibu'
  const bridePhoto = (props.bridePhoto as string) || null
  const groomPhoto = (props.groomPhoto as string) || null
  const themeColor = (props.themeColor as string) || 'var(--inv-primary)'
  const textColor = (props.textColor as string) || 'var(--inv-text)'

  return (
    <div className="w-full py-16 px-4 md:px-6 text-center overflow-hidden bg-white" style={{ color: textColor }}>
      <FadeInView variants={staggerContainer} margin="-100px" className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.h2 variants={fadeUp} className="text-3xl font-serif italic mb-8 md:mb-12" style={{ color: themeColor }}>
          The Happy Couple
        </motion.h2>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 w-full">
          {/* Bride */}
          <motion.div variants={fadeUp} className="flex flex-col items-center w-full max-w-[250px]">
            <CoupleCard name={brideName} desc={brideDesc} photo={bridePhoto} themeColor={themeColor} textColor={textColor} />
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="text-5xl font-serif italic opacity-50 my-2" style={{ color: themeColor }}>
            &
          </motion.div>

          {/* Groom */}
          <motion.div variants={fadeUp} className="flex flex-col items-center w-full max-w-[250px]">
            <CoupleCard name={groomName} desc={groomDesc} photo={groomPhoto} themeColor={themeColor} textColor={textColor} />
          </motion.div>
        </div>
      </FadeInView>
    </div>
  )
}

function CoupleCard({ name, desc, photo, themeColor, textColor }: { name: string; desc: string; photo: string | null; themeColor: string; textColor: string }) {
  return (
    <>
      <div
        className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 shadow-lg shrink-0 flex items-center justify-center relative group"
        style={{ borderColor: themeColor, backgroundColor: '#f8fafc' }}
      >
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <span className="text-5xl transition-transform duration-700 group-hover:scale-110" style={{ fontFamily: 'serif', color: themeColor }}>
            {name.charAt(0)}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-serif font-bold mb-2 break-words text-center" style={{ color: textColor }}>
        {name}
      </h3>
      
      <p className="text-sm opacity-80 leading-relaxed text-center px-4" style={{ color: textColor }}>
        {desc}
      </p>
    </>
  )
}
