import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const TEMPLATE_PATH = path.join(process.cwd(), 'wrangler.template.jsonc')
const OUTPUT_PATH = path.join(process.cwd(), 'wrangler.jsonc')

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ Template file not found!')
  process.exit(1)
}

let content: string = fs.readFileSync(TEMPLATE_PATH, 'utf-8')

const vars: Record<string, string | undefined> = {
  CF_D1_ID_PROD: process.env.CF_D1_ID_PROD,
  CF_D1_NAME_PROD: process.env.CF_D1_NAME_PROD,
  CF_R2_BUCKET_NAME_PROD: process.env.CF_R2_BUCKET_NAME_PROD,
}

console.log('--- Generating wrangler.jsonc ---')

for (const [key, value] of Object.entries(vars)) {
  const placeholder = `{{${key}}}`
  
  if (!value) {
    console.warn(`⚠️  Warning: Environment variable "${key}" is missing in .env`)
  }

  content = content.replaceAll(placeholder, value || '')
}

try {
  fs.writeFileSync(OUTPUT_PATH, content)
  console.log('✅ wrangler.jsonc has been successfully generated.')
} catch (error) {
  console.error('❌ Failed to write wrangler.jsonc:', error)
  process.exit(1)
}