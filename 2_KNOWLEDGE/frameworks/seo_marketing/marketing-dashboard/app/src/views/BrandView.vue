<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-heading font-bold text-gradient mb-2">Brand Center</h1>
      <p class="text-text-secondary">
        Visual design system and brand guidelines for your marketing assets
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="brandStore.loading && !brandStore.tokens" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      <p class="text-text-secondary mt-4">Loading brand assets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="brandStore.error && !brandStore.tokens" class="text-center py-12">
      <p class="text-warning">Failed to load brand data: {{ brandStore.error }}</p>
    </div>

    <!-- Brand Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Color Palette -->
      <ColorPalette :tokens="brandStore.tokens" />

      <!-- Typography -->
      <TypographyPreview :tokens="brandStore.tokens" />

      <!-- Spacing Scale -->
      <SpacingScale :tokens="brandStore.tokens" />

      <!-- Component Showcase -->
      <ComponentShowcase :tokens="brandStore.tokens" />

      <!-- Logo Gallery -->
      <LogoGallery
        :logos="brandStore.logos"
        :loading="brandStore.loading"
        @upload="handleLogoUpload"
      />

      <!-- Voice Summary -->
      <VoiceSummary
        :voice="brandStore.voice"
        :loading="brandStore.loading"
        :error="brandStore.error"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBrandStore } from '../stores/brand'

import ColorPalette from '../components/brand/ColorPalette.vue'
import TypographyPreview from '../components/brand/TypographyPreview.vue'
import SpacingScale from '../components/brand/SpacingScale.vue'
import ComponentShowcase from '../components/brand/ComponentShowcase.vue'
import LogoGallery from '../components/brand/LogoGallery.vue'
import VoiceSummary from '../components/brand/VoiceSummary.vue'

const brandStore = useBrandStore()

onMounted(async () => {
  await brandStore.fetchAll()
})

function handleLogoUpload(file) {
  brandStore.uploadLogo(file)
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
