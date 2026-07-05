import React from 'react'

export const defaultCoupleProps = {
  brideName: 'Juliet Capulet',
  brideDesc: 'Putri dari Bpk. Capulet & Ibu Capulet',
  bridePhoto: 'https://images.unsplash.com/photo-1546820580-9b578c7f99ee?q=80&w=400&auto=format&fit=crop',
  groomName: 'Romeo Montague',
  groomDesc: 'Putra dari Bpk. Montague & Ibu Montague',
  groomPhoto: 'https://images.unsplash.com/photo-1566752003848-12c5b3ab3b37?q=80&w=400&auto=format&fit=crop',
  themeColor: '#C8A882',
  textColor: '#333333'
}

export function CoupleWidget({ props }: { props: typeof defaultCoupleProps }) {
  return (
    <div className="w-full py-16 px-4 md:px-6 bg-white text-center" style={{ color: props.textColor }}>
      <h2 className="text-3xl font-serif italic mb-8 md:mb-12" style={{ color: props.themeColor }}>The Happy Couple</h2>
      
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16">
        {/* Bride */}
        <div className="flex flex-col items-center w-full max-w-[250px]">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 shadow-lg shrink-0" style={{ borderColor: props.themeColor }}>
            <img src={props.bridePhoto} alt="Bride" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-serif font-bold mb-2 break-words text-center">{props.brideName}</h3>
          <p className="text-sm opacity-80 leading-relaxed text-center px-4">{props.brideDesc}</p>
        </div>

        {/* Separator */}
        <div className="text-5xl font-serif italic opacity-50 my-2" style={{ color: props.themeColor }}>&</div>

        {/* Groom */}
        <div className="flex flex-col items-center w-full max-w-[250px]">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 shadow-lg shrink-0" style={{ borderColor: props.themeColor }}>
            <img src={props.groomPhoto} alt="Groom" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-serif font-bold mb-2 break-words text-center">{props.groomName}</h3>
          <p className="text-sm opacity-80 leading-relaxed text-center px-4">{props.groomDesc}</p>
        </div>
      </div>
    </div>
  )
}
