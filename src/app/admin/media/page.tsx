import { getAllMedia } from '@/application/queries/admin.queries'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default async function AdminMediaPage() {
  const mediaFiles = await getAllMedia()

  const totalSize = mediaFiles.reduce((acc: number, m: any) => acc + m.size, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau penggunaan storage secara global di seluruh tenant.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between max-w-sm">
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Storage Used</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{formatBytes(totalSize)}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
          💾
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Preview</th>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">File Info</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mediaFiles.map((media: any) => (
                <tr key={media.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {media.fileType.startsWith('image/') ? (
                      <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden relative border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media.fileUrl} alt="Media" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        📄
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{media.tenant.businessName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-slate-500 truncate max-w-xs">{media.fileUrl.split('/').pop()}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{media.fileType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{formatBytes(media.size)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold tracking-wider uppercase">
                      {media.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={media.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </a>
                  </td>
                </tr>
              ))}
              {mediaFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada media diunggah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
