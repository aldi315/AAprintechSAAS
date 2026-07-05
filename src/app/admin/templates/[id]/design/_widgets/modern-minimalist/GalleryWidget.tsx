import React from 'react'

export const defaultGalleryMinimalistProps = {
  title: 'Gallery',
  images: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=400&auto=format&fit=crop'
  ],
  columns: 2,
  themeColor: '#000000',
  bgColor: '#ffffff',
  textColor: '#000000'
}

export function GalleryMinimalistWidget({ props }: { props: typeof defaultGalleryMinimalistProps }) {
  return (
    <div className="w-full py-20 px-6" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <h3 className="text-3xl font-sans font-medium uppercase tracking-tight mb-10">{props.title}</h3>
      
      <div className="grid grid-cols-2 gap-2 max-w-4xl mx-auto">
        {Array.isArray(props.images) && props.images.filter(img => typeof img === 'string' && img.trim() !== '').map((img, idx) => (
          <div key={idx} className={`w-full overflow-hidden ${idx % 3 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}>
            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  )
}
