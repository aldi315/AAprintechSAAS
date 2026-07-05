import React from 'react'

export const defaultGiftProps = {
  title: 'Wedding Gift',
  description: 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.',
  accounts: [
    { bankName: 'BCA', accountNumber: '1234567890', accountName: 'Romeo Montague' }
  ],
  themeColor: '#C8A882',
  bgColor: '#FDFBF7',
  textColor: '#333333'
}

export function GiftWidget({ props }: { props: typeof defaultGiftProps }) {
  // Defensive check for backwards compatibility
  const accounts = Array.isArray(props.accounts) ? props.accounts : []

  return (
    <div className="w-full py-16 px-6 text-center" style={{ backgroundColor: props.bgColor, color: props.textColor }}>
      <div className="max-w-md mx-auto">
        <h3 className="text-3xl font-serif italic mb-4" style={{ color: props.themeColor }}>{props.title}</h3>
        <p className="text-sm opacity-80 mb-8 leading-relaxed">
          {props.description}
        </p>

        <div className="space-y-6">
          {accounts.map((acc, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white shadow-sm border" style={{ borderColor: `${props.themeColor}30` }}>
              <p className="font-bold text-lg mb-2">{acc.bankName}</p>
              <p className="text-xl tracking-wider font-mono mb-2">{acc.accountNumber}</p>
              <p className="text-sm opacity-80 mb-6">a.n. {acc.accountName}</p>

              <button 
                className="w-full py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: props.themeColor }}
                onClick={(e) => e.preventDefault()}
              >
                Salin Nomor Rekening
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
