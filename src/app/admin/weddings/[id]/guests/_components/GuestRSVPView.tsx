'use client'

import { useState } from 'react'
import { Users, MailOpen, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function GuestRSVPView({ details, guests, rsvps }: { details: any, guests: any[], rsvps: any[] }) {
  const [activeTab, setActiveTab] = useState<'GUESTS' | 'RSVP'>('GUESTS')

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/weddings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Undangan
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tamu & RSVP: {details.brideName} & {details.groomName}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span>{details.tenant?.businessName}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <Link href={`/${details.slug}`} target="_blank" className="text-indigo-600 hover:underline flex items-center gap-1">
                /{details.slug} <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Tamu</p>
              <p className="text-xl font-bold text-slate-800">{guests.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total RSVP</p>
              <p className="text-xl font-bold text-slate-800">{rsvps.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('GUESTS')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'GUESTS' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Buku Tamu ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('RSVP')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
              activeTab === 'RSVP' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MailOpen className="w-4 h-4" />
            Status RSVP ({rsvps.length})
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          {activeTab === 'GUESTS' ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Tamu</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">No. HP</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode Akses</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{g.guestName}</td>
                    <td className="px-6 py-4 text-slate-600">{g.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs">{g.guestCode}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        g.attendanceStatus === 'ATTENDING' ? 'bg-green-100 text-green-800' :
                        g.attendanceStatus === 'NOT_ATTENDING' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {g.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Belum ada tamu yang diundang.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Tamu</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kehadiran</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah Hadir</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pesan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rsvps.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {r.guest ? r.guest.guestName : 'Tamu Umum'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.attendance === 'ATTENDING' ? 'bg-green-100 text-green-800' :
                        r.attendance === 'NOT_ATTENDING' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {r.attendance}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.totalGuest} Orang</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={r.message}>
                      {r.message || '-'}
                    </td>
                  </tr>
                ))}
                {rsvps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Belum ada RSVP yang masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
