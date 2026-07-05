const { Pool } = require('pg')

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/invit_db' })
  const res = await pool.query(`SELECT w.slug, w.status, w."customConfig", t.name as template_name, t."themeConfig" as template_config FROM "Wedding" w JOIN "Template" t ON w."templateId" = t.id WHERE w.slug = 'wedding-reki-raka'`)
  console.log('Result:', JSON.stringify(res.rows[0], null, 2))
  await pool.end()
}

main().catch(console.error)
