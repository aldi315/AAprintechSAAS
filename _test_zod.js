const { Pool } = require('pg')

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/invit_db' })
  const res = await pool.query(`SELECT w.slug, t.name as template_name, t."themeConfig" as template_config FROM "Wedding" w JOIN "Template" t ON w."templateId" = t.id WHERE w.slug = 'wedding-reki-raka'`)
  const config = res.rows[0].template_config

  console.log('Template Config directly from DB:', JSON.stringify(config, null, 2).slice(0, 500) + '...')
  
  // Try to use Zod to validate directly to see error
  const { z } = require('zod')
  const ThemeSchemaZod = z.object({
    primaryColor: z.string().default('#C8A882'),
    secondaryColor: z.string().default('#F5F0EA'),
    accentColor: z.string().default('#8B6F47'),
    backgroundColor: z.string().default('#FDFAF6'),
    textColor: z.string().default('#2D2D2D'),
    fontHeading: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('playfair'),
    fontScript: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('great-vibes'),
    fontBody: z.enum(['playfair', 'cormorant', 'great-vibes', 'lato', 'inter']).default('lato'),
  })
  const SectionSchemaZod = z.object({
    id: z.string(),
    type: z.enum(['cover', 'hero', 'couple', 'event', 'countdown', 'gallery', 'rsvp', 'closing', 'text', 'spacer', 'gift', 'music']),
    enabled: z.boolean().default(true),
    props: z.record(z.string(), z.unknown()).default({}),
  })
  const TemplateSchemaV1Zod = z.object({
    version: z.literal(1),
    theme: ThemeSchemaZod,
    sections: z.array(SectionSchemaZod),
  })

  const result = TemplateSchemaV1Zod.safeParse(config)
  if (!result.success) {
    console.log('Zod validation failed:', JSON.stringify(result.error.format(), null, 2))
  } else {
    console.log('Zod validation SUCCESS!')
  }

  await pool.end()
}

main().catch(console.error)
