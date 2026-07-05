import React from 'react'

export const defaultGalleryProps = {
  title: 'Our Moments',
  images: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=400&auto=format&fit=crop'
  ],
  columns: 2,
  themeColor: '#C8A882',
  bgColor: '#ffffff',
  textColor: '#333333'
}

export function GalleryWidget({ props }: { props: typeof defaultGalleryProps }) {
  return (
    <div className="w-full py-16 px-6 text-center" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <h3 className="text-3xl font-serif italic mb-8" style={{ color: props.themeColor }}>{props.title}</h3>
      
      <div 
        className="grid gap-4 max-w-4xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }}
      >
        {Array.isArray(props.images) && props.images.filter(img => typeof img === 'string' && img.trim() !== '').map((img, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
