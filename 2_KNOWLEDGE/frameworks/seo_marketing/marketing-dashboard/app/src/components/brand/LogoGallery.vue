<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-heading font-semibold">Logo Gallery</h3>
      <label
        class="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-secondary-hover transition-colors"
      >
        Upload Logo
        <input
          type="file"
          accept="image/*"
          @change="handleUpload"
          class="hidden"
        />
      </label>
    </div>

    <div v-if="loading" class="text-text-secondary">Loading logos...</div>

    <div v-else-if="!logos || logos.length === 0" class="text-text-secondary text-center py-8">
      No logos found. Upload your brand logos to get started.
    </div>

    <div v-else class="space-y-6">
      <!-- Group by category -->
      <div
        v-for="category in categories"
        :key="category"
      >
        <h4 class="text-sm font-medium text-text-secondary mb-3 capitalize">
          {{ category.replace(/-/g, ' ') }}
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="logo in logosByCategory[category]"
            :key="logo.path"
            @click="previewLogo(logo)"
            class="bg-background border border-border rounded-lg p-4 cursor-pointer hover:border-secondary transition-colors group"
          >
            <div class="aspect-square flex items-center justify-center mb-2">
              <img
                :src="logo.url"
                :alt="logo.name"
                class="max-w-full max-h-full object-contain"
              />
            </div>
            <p class="text-xs text-text-secondary truncate group-hover:text-secondary">
              {{ logo.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Transition name="modal">
      <div
        v-if="selectedLogo"
        @click="selectedLogo = null"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-surface border border-border rounded-xl p-6 max-w-2xl w-full">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-heading font-semibold">{{ selectedLogo.name }}</h4>
            <button
              @click.stop="selectedLogo = null"
              class="text-text-secondary hover:text-text-primary"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="bg-background rounded-lg p-8 flex items-center justify-center">
            <img
              :src="selectedLogo.url"
              :alt="selectedLogo.name"
              class="max-w-full max-h-96 object-contain"
            />
          </div>
          <div class="mt-4 text-sm text-text-secondary">
            <p>Category: {{ selectedLogo.category }}</p>
            <p class="font-mono mt-1">{{ selectedLogo.path }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Upload Notification -->
    <Transition name="fade">
      <div
        v-if="uploadSuccess"
        class="fixed bottom-4 right-4 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Logo uploaded successfully!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  logos: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['upload'])

const selectedLogo = ref(null)
const uploadSuccess = ref(false)

const categories = computed(() => {
  const cats = new Set(props.logos.map(l => l.category))
  return Array.from(cats).sort()
})

const logosByCategory = computed(() => {
  return props.logos.reduce((acc, logo) => {
    if (!acc[logo.category]) acc[logo.category] = []
    acc[logo.category].push(logo)
    return acc
  }, {})
})

function previewLogo(logo) {
  selectedLogo.value = logo
}

function handleUpload(event) {
  const file = event.target.files[0]
  if (file) {
    emit('upload', file)
    uploadSuccess.value = true
    setTimeout(() => {
      uploadSuccess.value = false
    }, 3000)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
