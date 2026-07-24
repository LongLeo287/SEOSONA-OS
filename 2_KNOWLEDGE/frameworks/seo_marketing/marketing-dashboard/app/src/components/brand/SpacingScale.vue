<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <h3 class="text-lg font-heading font-semibold mb-4">Spacing Scale</h3>

    <div v-if="!tokens" class="text-text-secondary">Loading spacing...</div>

    <div v-else class="space-y-3">
      <div
        v-for="(space, key) in tokens.primitive.spacing"
        :key="key"
        class="flex items-center gap-4"
      >
        <span class="text-xs text-text-muted w-8">{{ key }}</span>
        <div
          :style="{ width: space.$value }"
          class="h-8 bg-gradient-to-r from-secondary to-accent rounded"
        />
        <span class="text-xs font-mono text-text-secondary ml-auto">
          {{ space.$value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tokens: {
    type: Object,
    default: null
  }
})
</script>
