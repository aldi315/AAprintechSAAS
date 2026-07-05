import React from 'react'

export const defaultCoupleMinimalistProps = {
  brideName: 'Juliet Capulet',
  brideDesc: 'Daughter of Lord and Lady Capulet.',
  bridePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
  groomName: 'Romeo Montague',
  groomDesc: 'Son of Lord and Lady Montague.',
  groomPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  themeColor: '#000000',
  bgColor: '#f9fafb',
  textColor: '#111827'
}

export function CoupleMinimalistWidget({ props }: { props: typeof defaultCoupleMinimalistProps }) {
  return (
    <div className="w-full py-20 px-6" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <div className="max-w-md mx-auto flex flex-col gap-16">
        {/* Bride */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
            {props.bridePhoto && <img src={props.bridePhoto} alt={props.brideName} className="w-full h-full object-cover grayscale" />}
          </div>
          <div>
            <h3 className="text-3xl font-sans font-medium uppercase tracking-tight mb-2">{props.brideName}</h3>
            <p className="text-sm opacity-70 leading-relaxed max-w-sm">{props.brideDesc}</p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-current opacity-20" />

        {/* Groom */}
        <div className="flex flex-col gap-4 text-right items-end">
          <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
            {props.groomPhoto && <img src={props.groomPhoto} alt={props.groomName} className="w-full h-full object-cover grayscale" />}
          </div>
          <div>
            <h3 className="text-3xl font-sans font-medium uppercase tracking-tight mb-2">{props.groomName}</h3>
            <p className="text-sm opacity-70 leading-relaxed max-w-sm ml-auto">{props.groomDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
