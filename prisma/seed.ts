/**
 * Prisma Seed
 * - SUPER_ADMIN account
 * - Default templates (dengan full schema)
 * - Sample published wedding: andi-sinta
 * - Sample events, guest, RSVP
 *
 * Jalankan: npm run db:seed
 */
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

// Load env file for database credentials when run directly
try {
  process.loadEnvFile()
} catch (e) {
  // Ignored if .env file is not present
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/invit_db?schema=public',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Full template schema (Elegant Rose) ─────────────────────────────────────

const elegantRoseThemeConfig = {
  version: 1,
  theme: {
    primaryColor: '#C8A882',
    secondaryColor: '#F5F0EA',
    accentColor: '#8B6F47',
    backgroundColor: '#FDFAF6',
    textColor: '#2D2D2D',
    fontHeading: 'playfair',
    fontScript: 'great-vibes',
    fontBody: 'lato',
  },
  sections: [
    { id: 'hero-1', type: 'hero', enabled: true, props: { showCountdown: true, overlayOpacity: 0.45 } },
    { id: 'couple-1', type: 'couple', enabled: true, props: { showParents: true, layout: 'side-by-side' } },
    { id: 'event-1', type: 'event', enabled: true, props: { showDresscode: true, showMapsButton: true } },
    { id: 'countdown-1', type: 'countdown', enabled: true, props: { targetEventIndex: 0 } },
    { id: 'gallery-1', type: 'gallery', enabled: true, props: { columns: 2, maxItems: 6 } },
    { id: 'rsvp-1', type: 'rsvp', enabled: true, props: { showGuestCount: true, showMessage: true, requireGuestCode: false } },
    { id: 'closing-1', type: 'closing', enabled: true, props: { message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.', hashtag: 'AndiSinta2026' } },
  ],
}

async function main() {
  console.log('🌱 Seeding database...')

  // ─── SUPER_ADMIN ─────────────────────────────────────────────────────────────
  const superAdminEmail = 'superadmin@aaprintech.com'
  const existing = await prisma.user.findFirst({ where: { email: superAdminEmail } })

  if (!existing) {
    const hashedPassword = await bcrypt.hash('SuperAdmin@123', 12)
    const admin = await prisma.user.create({
      data: { name: 'Super Admin', email: superAdminEmail, password: hashedPassword, role: 'SUPER_ADMIN' },
    })
    console.log(`✅ SUPER_ADMIN created: ${admin.email}`)
  } else {
    console.log(`⏩ SUPER_ADMIN already exists: ${superAdminEmail}`)
  }

  // ─── Template Categories ─────────────────────────────────────────────────────────────
  const categories = [
    { name: 'Elegant', slug: 'elegant' },
    { name: 'Modern', slug: 'modern' },
    { name: 'Floral', slug: 'floral' }
  ]

  let categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const exists = await prisma.templateCategory.findUnique({ where: { slug: cat.slug } })
    if (!exists) {
      const c = await prisma.templateCategory.create({ data: cat })
      categoryMap[cat.name] = c.id
    } else {
      categoryMap[cat.name] = exists.id
    }
  }

  // ─── Templates ───────────────────────────────────────────────────────────────
  const templates = [
    { name: 'Elegant Rose', categoryId: categoryMap['Elegant'], premium: false, themeConfig: elegantRoseThemeConfig },
    { name: 'Modern Minimalist', categoryId: categoryMap['Modern'], premium: false, themeConfig: { version: 1, theme: { primaryColor: '#2D2D2D', secondaryColor: '#F8F8F8', accentColor: '#888888', backgroundColor: '#FFFFFF', textColor: '#111111', fontHeading: 'inter', fontScript: 'inter', fontBody: 'inter' }, sections: elegantRoseThemeConfig.sections } },
    { name: 'Floral Garden', categoryId: categoryMap['Floral'], premium: true, themeConfig: { version: 1, theme: { primaryColor: '#7B9E87', secondaryColor: '#FDF6EC', accentColor: '#D4A853', backgroundColor: '#FAFAF7', textColor: '#2D2D2D', fontHeading: 'cormorant', fontScript: 'great-vibes', fontBody: 'lato' }, sections: elegantRoseThemeConfig.sections } },
  ]

  let elegantRoseTemplate: { id: string } | null = null
  for (const template of templates) {
    const exists = await prisma.template.findFirst({ where: { name: template.name } })
    if (!exists) {
      const t = await prisma.template.create({ data: template })
      console.log(`✅ Template created: ${template.name}`)
      if (template.name === 'Elegant Rose') elegantRoseTemplate = t
    } else {
      console.log(`⏩ Template exists: ${template.name}`)
      if (template.name === 'Elegant Rose') {
        elegantRoseTemplate = exists
        // Update themeConfig ke full schema
        await prisma.template.update({ where: { id: exists.id }, data: { themeConfig: elegantRoseThemeConfig } })
      }
    }
  }

  // ─── Demo Tenant & User (untuk sample wedding) ────────────────────────────
  const demoEmail = 'demo@aaprintech.com'
  let demoUser = await prisma.user.findFirst({ where: { email: demoEmail } })
  if (!demoUser) {
    const hashedPw = await bcrypt.hash('Demo@123456', 12)
    demoUser = await prisma.user.create({
      data: { name: 'Demo Tenant', email: demoEmail, password: hashedPw, role: 'TENANT' },
    })
    console.log(`✅ Demo user created: ${demoEmail}`)
  }

  let demoTenant = await prisma.tenant.findFirst({ where: { slug: 'demo-aaprintech' } })
  if (!demoTenant) {
    demoTenant = await prisma.tenant.create({
      data: {
        businessName: 'AAP Wedding',
        slug: 'demo-aaprintech',
        ownerId: demoUser.id,
        subscriptionStatus: 'TRIAL',
        settings: { brandColor: '#C8A882', logo: null },
      },
    })
    console.log(`✅ Demo tenant created: demo-aaprintech`)
  }

  // ─── Sample Published Wedding: andi-sinta ────────────────────────────────
  const weddingSlug = 'andi-sinta'
  const existingWedding = await prisma.wedding.findFirst({ where: { slug: weddingSlug } })

  if (!existingWedding && elegantRoseTemplate) {
    const wedding = await prisma.wedding.create({
      data: {
        tenantId: demoTenant.id,
        slug: weddingSlug,
        brideName: 'Sinta Maharani',
        groomName: 'Andi Pratama',
        timezone: 'Asia/Jakarta',
        templateId: elegantRoseTemplate.id,
        status: 'PUBLISHED',
        metaTitle: 'Undangan Pernikahan Andi & Sinta',
        metaDescription: 'Dengan penuh kebahagiaan, kami mengundang Anda hadir di pernikahan kami.',
        gallery: [
          { url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800', caption: 'Prewedding' },
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Moment bersama' },
        ],
      },
    })

    // Events
    await prisma.weddingEvent.createMany({
      data: [
        {
          weddingId: wedding.id,
          name: 'Akad Nikah',
          startTime: new Date('2026-09-12T08:00:00+07:00'),
          endTime: new Date('2026-09-12T10:00:00+07:00'),
          location: 'Masjid Agung Al-Azhar, Jakarta Selatan',
          mapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar',
          dresscode: 'Putih & Krem',
        },
        {
          weddingId: wedding.id,
          name: 'Resepsi Pernikahan',
          startTime: new Date('2026-09-12T11:00:00+07:00'),
          endTime: new Date('2026-09-12T15:00:00+07:00'),
          location: 'Gedung Balai Kartini, Jl. Jend. Gatot Subroto, Jakarta',
          mapsUrl: 'https://maps.google.com/?q=Balai+Kartini+Jakarta',
          dresscode: 'Batik Nasional',
        },
      ],
    })

    // Sample Guest
    const guest = await prisma.invitationGuest.create({
      data: {
        weddingId: wedding.id,
        guestName: 'Budi Santoso',
        guestCode: 'BUDI-001',
        phone: '08123456789',
        attendanceStatus: 'ATTENDING',
      },
    })

    // Sample RSVP
    await prisma.rSVP.create({
      data: {
        weddingId: wedding.id,
        guestId: guest.id,
        attendance: 'ATTENDING',
        totalGuest: 2,
        message: 'Selamat ya! Semoga menjadi keluarga yang sakinah mawaddah warahmah 🤲',
      },
    })

    console.log(`✅ Sample wedding created: /${weddingSlug}`)
    console.log(`   🌍 Buka: http://localhost:3000/${weddingSlug}`)
    console.log(`   👤 Dengan nama tamu: http://localhost:3000/${weddingSlug}?to=Budi`)
  } else {
    console.log(`⏩ Sample wedding exists: /${weddingSlug}`)
  }

  console.log('✅ Seeding complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
