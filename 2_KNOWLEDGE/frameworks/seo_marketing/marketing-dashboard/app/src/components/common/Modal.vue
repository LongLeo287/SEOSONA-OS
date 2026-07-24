<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="$emit('close')"
      >
        <div class="relative bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border">
          <div class="flex items-center justify-between p-6 border-b border-border">
            <h2 class="text-xl font-heading font-semibold text-text-primary">{{ title }}</h2>
            <button
              @click="$emit('close')"
              class="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-elevated transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="p-6 border-t border-border bg-surface">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
