'use client'
import { Input, Select } from '@/presentation/dashboard/components/ui/Input'

interface ThemeData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontHeading: string
  fontScript: string
  fontBody: string
}

interface Props {
  theme: ThemeData
  onChange: (theme: ThemeData) => void
}

const fontOptions = [
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'cormorant', label: 'Cormorant Garamond' },
  { value: 'great-vibes', label: 'Great Vibes' },
  { value: 'lato', label: 'Lato' },
  { value: 'inter', label: 'Inter' },
]

export function ThemeEditor({ theme, onChange }: Props) {
  const handleChange = (key: keyof ThemeData, value: string) => {
    onChange({ ...theme, [key]: value })
  }

  const ColorInput = ({ label, field }: { label: string; field: keyof ThemeData }) => (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={theme[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
      />
      <div className="flex-1">
        <Input
          label={label}
          value={theme[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className="font-mono text-xs"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Warna Tema</h3>
        <div className="space-y-4">
          <ColorInput label="Warna Utama (Primary)" field="primaryColor" />
          <ColorInput label="Warna Sekunder" field="secondaryColor" />
          <ColorInput label="Aksen (Accent)" field="accentColor" />
          <ColorInput label="Background" field="backgroundColor" />
          <ColorInput label="Teks" field="textColor" />
        </div>
      </div>

      <hr className="border-slate-100" />

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Tipografi</h3>
        <div className="space-y-4">
          <Select
            label="Font Heading"
            options={fontOptions}
            value={theme.fontHeading}
            onChange={(e) => handleChange('fontHeading', e.target.value)}
          />
          <Select
            label="Font Script (Nama)"
            options={fontOptions}
            value={theme.fontScript}
            onChange={(e) => handleChange('fontScript', e.target.value)}
          />
          <Select
            label="Font Body"
            options={fontOptions}
            value={theme.fontBody}
            onChange={(e) => handleChange('fontBody', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
