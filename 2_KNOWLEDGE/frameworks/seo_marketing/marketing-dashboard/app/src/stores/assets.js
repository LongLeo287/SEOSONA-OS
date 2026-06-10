import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE } from '../config'

export const useAssetsStore = defineStore('assets', () => {
  const assets = ref([])
  const selectedAsset = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const categoryFilter = ref(null)

  const filteredAssets = computed(() => {
    if (!categoryFilter.value) return assets.value
    return assets.value.filter(a => a.category === categoryFilter.value)
  })

  const categories = computed(() => {
    const cats = new Set(assets.value.map(a => a.category).filter(Boolean))
    return Array.from(cats).sort()
  })

  async function fetchAssets() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/assets`, {
        headers: { 'X-API-Key': sessionStorage.getItem('api_key') || '' }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      assets.value = data.assets || []
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch assets:', e)
    } finally {
      loading.value = false
    }
  }

  async function scanAssets() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/assets/scan`, {
        method: 'POST',
        headers: { 'X-API-Key': sessionStorage.getItem('api_key') || '' }
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      await fetchAssets() // Refresh list after scan
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateAsset(id, updates) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': sessionStorage.getItem('api_key') || ''
        },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      const index = assets.value.findIndex(a => a.id === id)
      if (index !== -1) assets.value[index] = data.asset
      if (selectedAsset.value?.id === id) selectedAsset.value = data.asset
      return data.asset
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  function selectAsset(asset) {
    selectedAsset.value = asset
  }

  function setCategoryFilter(category) {
    categoryFilter.value = category
  }

  return {
    assets,
    selectedAsset,
    loading,
    error,
    categoryFilter,
    filteredAssets,
    categories,
    fetchAssets,
    scanAssets,
    updateAsset,
    selectAsset,
    setCategoryFilter
  }
})
