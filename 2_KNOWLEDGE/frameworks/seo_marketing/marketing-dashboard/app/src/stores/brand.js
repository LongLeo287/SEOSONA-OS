import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3457'

export const useBrandStore = defineStore('brand', () => {
  const tokens = ref(null)
  const voice = ref(null)
  const logos = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTokens() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/api/brand/tokens`)
      if (!res.ok) throw new Error('Failed to fetch tokens')
      tokens.value = await res.json()
    } catch (e) {
      error.value = e.message
      console.error('Error fetching tokens:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchVoice() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/api/brand/voice`)
      if (!res.ok) throw new Error('Brand guidelines not found')
      voice.value = await res.json()
    } catch (e) {
      error.value = e.message
      console.error('Error fetching voice:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchLogos() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/api/brand/logos`)
      if (!res.ok) throw new Error('Failed to fetch logos')
      logos.value = await res.json()
    } catch (e) {
      error.value = e.message
      console.error('Error fetching logos:', e)
    } finally {
      loading.value = false
    }
  }

  async function uploadLogo(file) {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/api/brand/logos`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      await fetchLogos()
    } catch (e) {
      error.value = e.message
      console.error('Error uploading logo:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchAll() {
    await Promise.all([fetchTokens(), fetchVoice(), fetchLogos()])
  }

  return {
    tokens,
    voice,
    logos,
    loading,
    error,
    fetchTokens,
    fetchVoice,
    fetchLogos,
    uploadLogo,
    fetchAll
  }
})
