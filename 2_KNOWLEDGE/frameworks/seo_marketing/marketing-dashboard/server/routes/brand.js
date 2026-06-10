import { Hono } from 'hono'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)
const brand = new Hono()

// Security constants
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3457'

// Sanitize filename - remove path separators and dangerous chars
function sanitizeFilename(name) {
  return name
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/\.\./g, '')  // Remove parent directory refs
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only safe chars
    .slice(0, 100) // Limit length
}

// GET /api/brand/tokens - Read design-tokens.json
brand.get('/tokens', (c) => {
  try {
    const tokensPath = path.join(process.cwd(), '../../../assets/design-tokens.json')
    if (!fs.existsSync(tokensPath)) {
      return c.json({ error: 'Design tokens not found' }, 404)
    }
    const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'))
    return c.json(tokens)
  } catch (e) {
    console.error('Error reading tokens:', e)
    return c.json({ error: 'Failed to read design tokens' }, 500)
  }
})

// GET /api/brand/voice - Run inject-brand-context.cjs --json
brand.get('/voice', async (c) => {
  try {
    const scriptPath = path.resolve(process.cwd(), '../brand/scripts/inject-brand-context.cjs')
    const guidelinesPath = path.resolve(process.cwd(), '../../../docs/brand-guidelines.md')

    // Validate script exists
    if (!fs.existsSync(scriptPath)) {
      return c.json({ error: 'Brand guidelines script not found' }, 404)
    }
    // Validate guidelines exist
    if (!fs.existsSync(guidelinesPath)) {
      return c.json({ error: 'Brand guidelines file not found at docs/brand-guidelines.md' }, 404)
    }
    const { stdout } = await execFileAsync('node', [scriptPath, '--json', guidelinesPath])
    return c.json(JSON.parse(stdout))
  } catch (e) {
    console.error('Error fetching brand voice:', e)
    return c.json({ error: 'Failed to load brand voice', details: e.message }, 500)
  }
})

// GET /api/brand/logos - List logos folder
brand.get('/logos', (c) => {
  try {
    const logosPath = path.join(process.cwd(), '../../../assets/logos')
    if (!fs.existsSync(logosPath)) {
      fs.mkdirSync(logosPath, { recursive: true })
      return c.json([])
    }

    // Recursively scan subdirectories
    const scanDirectory = (dir, baseDir = dir) => {
      const files = []
      const items = fs.readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dir, item.name)
        if (item.isDirectory()) {
          files.push(...scanDirectory(fullPath, baseDir))
        } else if (/\.(png|jpg|jpeg|svg|webp)$/i.test(item.name)) {
          const relativePath = path.relative(baseDir, fullPath)
          files.push({
            name: item.name,
            path: relativePath,
            category: path.dirname(relativePath),
            url: `${API_BASE_URL}/static/logos/${relativePath.replace(/\\/g, '/')}`
          })
        }
      }
      return files
    }

    const logoFiles = scanDirectory(logosPath)
    return c.json(logoFiles)
  } catch (e) {
    console.error('Error listing logos:', e)
    return c.json({ error: 'Failed to list logos' }, 500)
  }
})

// POST /api/brand/logos - Upload logo
brand.post('/logos', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body.file

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Validate MIME type
    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Allowed: PNG, JPG, SVG, WebP' }, 400)
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return c.json({ error: 'File too large. Max 5MB' }, 400)
    }

    // Sanitize filename
    const safeName = sanitizeFilename(file.name)
    if (!safeName || safeName.startsWith('.')) {
      return c.json({ error: 'Invalid filename' }, 400)
    }

    const logosPath = path.join(process.cwd(), '../../../assets/logos')
    if (!fs.existsSync(logosPath)) {
      fs.mkdirSync(logosPath, { recursive: true })
    }

    // Save to root of logos directory
    const buffer = await file.arrayBuffer()
    const filePath = path.join(logosPath, safeName)
    fs.writeFileSync(filePath, Buffer.from(buffer))

    return c.json({ success: true, name: safeName, path: safeName })
  } catch (e) {
    console.error('Error uploading logo:', e)
    return c.json({ error: 'Upload failed' }, 500)
  }
})

export default brand
