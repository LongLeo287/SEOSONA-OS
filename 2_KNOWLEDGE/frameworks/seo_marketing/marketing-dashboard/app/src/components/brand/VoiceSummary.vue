<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <h3 class="text-lg font-heading font-semibold mb-4">Brand Voice</h3>

    <div v-if="loading" class="text-text-secondary">Loading brand voice...</div>

    <div v-else-if="error" class="text-warning text-sm">
      <p>⚠️ {{ error }}</p>
      <p class="mt-2 text-xs text-text-secondary">
        Brand guidelines not configured. Add brand documentation to enable this feature.
      </p>
    </div>

    <div v-else-if="!voice" class="text-text-secondary">No brand voice data available.</div>

    <div v-else class="space-y-6">
      <!-- Voice Traits -->
      <div v-if="voice.traits && voice.traits.length > 0">
        <h4 class="text-sm font-medium text-text-secondary mb-3">Voice Traits</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="trait in voice.traits"
            :key="trait"
            class="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm border border-secondary/20"
          >
            {{ trait }}
          </span>
        </div>
      </div>

      <!-- Tone -->
      <div v-if="voice.tone">
        <h4 class="text-sm font-medium text-text-secondary mb-3">Tone</h4>
        <p class="text-text-primary">{{ voice.tone }}</p>
      </div>

      <!-- Key Messages -->
      <div v-if="voice.keyMessages && voice.keyMessages.length > 0">
        <h4 class="text-sm font-medium text-text-secondary mb-3">Key Messages</h4>
        <ul class="space-y-2">
          <li
            v-for="(message, index) in voice.keyMessages"
            :key="index"
            class="text-sm text-text-primary flex items-start gap-2"
          >
            <span class="text-secondary mt-1">•</span>
            <span>{{ message }}</span>
          </li>
        </ul>
      </div>

      <!-- Prohibited -->
      <div v-if="voice.prohibited && voice.prohibited.length > 0">
        <h4 class="text-sm font-medium text-text-secondary mb-3">⚠️ Avoid</h4>
        <div class="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <ul class="space-y-1">
            <li
              v-for="(item, index) in voice.prohibited"
              :key="index"
              class="text-sm text-warning flex items-start gap-2"
            >
              <span>×</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Additional Context -->
      <div v-if="voice.context" class="text-xs text-text-muted border-t border-border pt-4">
        {{ voice.context }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  voice: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})
</script>
