'use client'

export function LivePreview({ slug }: { slug: string }) {
  // Gunakan timestamp cache-buster agar iframe refresh jika diperlukan
  const previewUrl = `/${slug}`

  return (
    <div className="bg-slate-200 rounded-2xl p-4 flex justify-center sticky top-20">
      <div className="relative w-full max-w-[375px] aspect-[9/19] bg-white rounded-[32px] overflow-hidden shadow-2xl ring-8 ring-slate-800">
        {/* Notch simulation */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto z-10" />
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="Live Preview"
        />
      </div>
    </div>
  )
}
