<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <h3 class="text-lg font-heading font-semibold mb-4">Color Palette</h3>

    <div v-if="!tokens" class="text-text-secondary">Loading colors...</div>

    <div v-else class="space-y-6">
      <!-- Coral (Blue) -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Primary (Coral)</h4>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(shade, key) in tokens.primitive.color.coral"
            :key="key"
            @click="copyColor(shade.$value)"
            class="cursor-pointer group"
          >
            <div
              :style="{ backgroundColor: shade.$value }"
              class="h-12 rounded-lg border border-border-strong shadow-sm group-hover:scale-105 transition-transform"
            />
            <p class="text-xs text-text-secondary mt-1">{{ key }}</p>
            <p class="text-xs font-mono text-text-muted">{{ shade.$value }}</p>
          </div>
        </div>
      </div>

      <!-- Purple (Teal) -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Secondary (Purple)</h4>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(shade, key) in tokens.primitive.color.purple"
            :key="key"
            @click="copyColor(shade.$value)"
            class="cursor-pointer group"
          >
            <div
              :style="{ backgroundColor: shade.$value }"
              class="h-12 rounded-lg border border-border-strong shadow-sm group-hover:scale-105 transition-transform"
            />
            <p class="text-xs text-text-secondary mt-1">{{ key }}</p>
            <p class="text-xs font-mono text-text-muted">{{ shade.$value }}</p>
          </div>
        </div>
      </div>

      <!-- Mint (Yellow/Amber) -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Accent (Mint)</h4>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(shade, key) in tokens.primitive.color.mint"
            :key="key"
            @click="copyColor(shade.$value)"
            class="cursor-pointer group"
          >
            <div
              :style="{ backgroundColor: shade.$value }"
              class="h-12 rounded-lg border border-border-strong shadow-sm group-hover:scale-105 transition-transform"
            />
            <p class="text-xs text-text-secondary mt-1">{{ key }}</p>
            <p class="text-xs font-mono text-text-muted">{{ shade.$value }}</p>
          </div>
        </div>
      </div>

      <!-- Dark -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Neutrals (Dark)</h4>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(shade, key) in tokens.primitive.color.dark"
            :key="key"
            @click="copyColor(shade.$value)"
            class="cursor-pointer group"
          >
            <div
              :style="{ backgroundColor: shade.$value }"
              class="h-12 rounded-lg border border-border-strong shadow-sm group-hover:scale-105 transition-transform"
            />
            <p class="text-xs text-text-secondary mt-1">{{ key }}</p>
            <p class="text-xs font-mono text-text-muted">{{ shade.$value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <Transition name="fade">
      <div
        v-if="showCopied"
        class="fixed bottom-4 right-4 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Color copied to clipboard!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tokens: {
    type: Object,
    default: null
  }
})

const showCopied = ref(false)

function copyColor(hex) {
  navigator.clipboard.writeText(hex)
  showCopied.value = true
  setTimeout(() => {
    showCopied.value = false
  }, 2000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
