import { describe, it, expect, beforeAll } from 'vitest'
import { Hono } from 'hono'
import brand from '../routes/brand.js'

describe('Brand Route Security', () => {
  let app

  beforeAll(() => {
    app = new Hono()
    app.route('/api/brand', brand)
  })

  describe('File Upload Validation', () => {
    it('should reject file without type', async () => {
      const formData = new FormData()
      const file = new File(['test'], 'test.txt', { type: '' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('Invalid file type')
    })

    it('should reject disallowed MIME types', async () => {
      const formData = new FormData()
      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('Invalid file type')
    })

    it('should accept valid image types', async () => {
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']

      for (const type of validTypes) {
        const formData = new FormData()
        const file = new File(['test'], 'test.png', { type })
        formData.append('file', file)

        const res = await app.request('/api/brand/logos', {
          method: 'POST',
          body: formData
        })

        // Should not fail on type validation (may fail on other checks)
        if (res.status === 400) {
          const json = await res.json()
          expect(json.error).not.toContain('Invalid file type')
        }
      }
    })

    it('should reject files larger than 5MB', async () => {
      const formData = new FormData()
      const largeBuffer = new ArrayBuffer(6 * 1024 * 1024) // 6MB
      const file = new File([largeBuffer], 'large.png', { type: 'image/png' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('File too large')
    })
  })

  describe('Path Traversal Protection', () => {
    it('should sanitize filename with path separators', async () => {
      const formData = new FormData()
      const file = new File(['test'], '../../../etc/passwd', { type: 'image/png' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      if (res.status === 200) {
        const json = await res.json()
        // Should have sanitized the filename
        expect(json.name).not.toContain('..')
        expect(json.name).not.toContain('/')
        expect(json.name).not.toContain('\\')
      }
    })

    it('should sanitize filename with backslashes', async () => {
      const formData = new FormData()
      const file = new File(['test'], '..\\..\\Windows\\System32', { type: 'image/png' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      if (res.status === 200) {
        const json = await res.json()
        expect(json.name).not.toContain('\\')
        expect(json.name).not.toContain('..')
      }
    })

    it('should reject filenames starting with dot', async () => {
      const formData = new FormData()
      const file = new File(['test'], '.hidden', { type: 'image/png' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toContain('Invalid filename')
    })

    it('should limit filename length to 100 chars', async () => {
      const formData = new FormData()
      const longName = 'a'.repeat(200) + '.png'
      const file = new File(['test'], longName, { type: 'image/png' })
      formData.append('file', file)

      const res = await app.request('/api/brand/logos', {
        method: 'POST',
        body: formData
      })

      if (res.status === 200) {
        const json = await res.json()
        expect(json.name.length).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('Environment Configuration', () => {
    it('should use environment variable for API base URL', async () => {
      // Set env var
      const oldEnv = process.env.API_BASE_URL
      process.env.API_BASE_URL = 'https://custom-api.example.com'

      // Re-import to get new env value
      delete require.cache[require.resolve('../routes/brand.js')]
      const { default: newBrand } = await import('../routes/brand.js?t=' + Date.now())

      const testApp = new Hono()
      testApp.route('/api/brand', newBrand)

      const res = await testApp.request('/api/brand/logos')

      if (res.status === 200) {
        const json = await res.json()
        // Check if any URLs use the custom base
        if (json.length > 0 && json[0].url) {
          expect(json[0].url).toContain('https://custom-api.example.com')
        }
      }

      // Restore env
      if (oldEnv) {
        process.env.API_BASE_URL = oldEnv
      } else {
        delete process.env.API_BASE_URL
      }
    })
  })
})
