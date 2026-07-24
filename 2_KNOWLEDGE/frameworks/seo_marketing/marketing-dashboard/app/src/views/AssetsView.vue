<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-heading font-bold text-gradient">Asset Gallery</h2>
        <p class="mt-2 text-sm text-text-secondary">Browse and manage your marketing assets</p>
      </div>
      <button
        @click="handleScan"
        :disabled="assetsStore.loading"
        class="px-4 py-2 text-sm font-medium text-white btn-gradient rounded-lg disabled:opacity-50"
      >
        {{ assetsStore.loading ? 'Scanning...' : 'Scan Assets' }}
      </button>
    </div>

    <LoadingSpinner v-if="assetsStore.loading" class="mt-12" />
    <div v-else-if="assetsStore.error" class="bg-red-900/20 border border-red-700 rounded-xl p-4 text-red-400">
      Error: {{ assetsStore.error }}
    </div>
    <AssetGrid v-else :folder="currentFolder" @view="handleView" @navigate="handleNavigate" />

    <AssetPreview
      v-if="previewAsset"
      :asset="previewAsset"
      :all-assets="assetsStore.assets"
      @close="handleClose"
      @select="handleView"
    />

    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssetsStore } from '../stores/assets'
import AssetGrid from '../components/assets/AssetGrid.vue'
import AssetPreview from '../components/assets/AssetPreview.vue'
import Toast from '../components/common/Toast.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const assetsStore = useAssetsStore()

const previewAsset = ref(null)
const currentFolder = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

function handleNavigate(folder) {
  currentFolder.value = folder
  // Update URL with folder query param, preserve asset if any
  updateUrlParams()
}

function handleView(asset) {
  previewAsset.value = asset
  // Update URL with asset ID query param
  updateUrlParams()
}

function handleClose() {
  previewAsset.value = null
  // Remove asset param, keep folder
  updateUrlParams()
}

function updateUrlParams() {
  const query = {}
  if (currentFolder.value) query.folder = currentFolder.value
  if (previewAsset.value) query.asset = previewAsset.value.id
  router.replace({ query })
}

async function handleScan() {
  try {
    const result = await assetsStore.scanAssets()
    showToast(`Scanned ${result.scanned} assets: ${result.inserted} new, ${result.updated} updated`)
  } catch (e) {
    showToast('Failed to scan assets', 'error')
  }
}

// Restore folder and asset from URL query params after assets load
watch(() => assetsStore.assets, (assets) => {
  if (assets.length) {
    // Restore folder from URL
    if (route.query.folder && !currentFolder.value) {
      currentFolder.value = route.query.folder
    }
    // Restore asset preview from URL
    if (route.query.asset && !previewAsset.value) {
      const asset = assets.find(a => a.id === route.query.asset)
      if (asset) previewAsset.value = asset
    }
  }
}, { immediate: true })

onMounted(() => {
  assetsStore.fetchAssets()
})
</script>
