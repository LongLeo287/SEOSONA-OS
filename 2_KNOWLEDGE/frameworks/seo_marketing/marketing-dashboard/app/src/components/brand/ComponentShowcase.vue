<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <h3 class="text-lg font-heading font-semibold mb-4">Component Examples</h3>

    <div v-if="!tokens" class="text-text-secondary">Loading components...</div>

    <div v-else class="space-y-6">
      <!-- Buttons -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Buttons</h4>
        <div class="flex flex-wrap gap-3">
          <button
            :style="{
              backgroundColor: getToken('component.button.primary.bg'),
              color: getToken('component.button.primary.fg'),
              borderRadius: getToken('component.button.primary.radius'),
              padding: `${getToken('component.button.primary.padding-y')} ${getToken('component.button.primary.padding-x')}`,
              fontSize: getToken('component.button.primary.font-size'),
              fontWeight: getToken('component.button.primary.font-weight'),
              boxShadow: getToken('component.button.primary.shadow')
            }"
            class="transition-all hover:opacity-90"
          >
            Primary Button
          </button>

          <button
            :style="{
              backgroundColor: getToken('component.button.secondary.bg'),
              color: getToken('component.button.secondary.fg'),
              borderRadius: getToken('component.button.primary.radius'),
              padding: `${getToken('component.button.primary.padding-y')} ${getToken('component.button.primary.padding-x')}`,
              fontSize: getToken('component.button.primary.font-size'),
              fontWeight: getToken('component.button.primary.font-weight'),
              border: `1px solid ${getToken('component.button.secondary.border')}`
            }"
            class="transition-all hover:bg-opacity-10"
          >
            Secondary Button
          </button>

          <button
            :style="{
              backgroundColor: getToken('component.button.ghost.bg'),
              color: getToken('component.button.ghost.fg'),
              borderRadius: getToken('component.button.primary.radius'),
              padding: `${getToken('component.button.primary.padding-y')} ${getToken('component.button.primary.padding-x')}`,
              fontSize: getToken('component.button.primary.font-size'),
              fontWeight: getToken('component.button.primary.font-weight')
            }"
            class="transition-all hover:bg-surface-elevated"
          >
            Ghost Button
          </button>
        </div>
      </div>

      <!-- Card -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Card</h4>
        <div
          :style="{
            backgroundColor: getToken('component.card.bg'),
            borderRadius: getToken('component.card.radius'),
            padding: getToken('component.card.padding'),
            boxShadow: getToken('component.card.shadow'),
            border: `1px solid ${getToken('component.card.border')}`
          }"
          class="max-w-sm transition-all hover:border-primary"
        >
          <h5 class="font-heading font-semibold text-lg mb-2">Card Title</h5>
          <p class="text-text-secondary text-sm">
            This is an example card component using design tokens for background, border, padding, and shadow.
          </p>
        </div>
      </div>

      <!-- Input -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Input Field</h4>
        <input
          type="text"
          placeholder="Enter text..."
          :style="{
            backgroundColor: getToken('component.input.bg'),
            color: getToken('component.input.fg'),
            borderRadius: getToken('component.input.radius'),
            padding: `${getToken('component.input.padding-y')} ${getToken('component.input.padding-x')}`,
            border: `1px solid ${getToken('component.input.border')}`
          }"
          class="max-w-sm w-full focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <!-- Radius Scale -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Border Radius</h4>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="(radius, key) in tokens.primitive.radius"
            :key="key"
            :style="{
              borderRadius: radius.$value,
              backgroundColor: getToken('semantic.color.secondary')
            }"
            class="w-16 h-16 flex items-center justify-center"
          >
            <span class="text-xs text-white">{{ key }}</span>
          </div>
        </div>
      </div>

      <!-- Shadows -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-3">Shadows</h4>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="(shadow, key) in filteredShadows"
            :key="key"
            :style="{
              boxShadow: shadow.$value,
              backgroundColor: getToken('semantic.color.surface'),
              borderRadius: getToken('primitive.radius.lg')
            }"
            class="w-24 h-24 flex items-center justify-center border border-border"
          >
            <span class="text-xs text-text-secondary text-center">{{ key }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tokens: {
    type: Object,
    default: null
  }
})

// Resolve token references like {primitive.color.coral.500}
function resolveToken(value) {
  if (!value || !props.tokens) return value
  const val = typeof value === 'object' ? value.$value : value
  if (!val || typeof val !== 'string') return val

  // Check if it's a reference
  const match = val.match(/^\{(.+)\}$/)
  if (!match) return val

  // Navigate the token path
  const path = match[1].split('.')
  let result = props.tokens
  for (const key of path) {
    if (result && result[key] !== undefined) {
      result = result[key]
    } else {
      return val // Return original if path not found
    }
  }

  // Recursively resolve if result is also a reference
  if (result && result.$value) {
    return resolveToken(result.$value)
  }
  return result
}

// Shorthand for getting resolved component token
function getToken(path) {
  const parts = path.split('.')
  let val = props.tokens
  for (const p of parts) {
    val = val?.[p]
  }
  return resolveToken(val)
}

const filteredShadows = computed(() => {
  if (!props.tokens) return {}
  const { none, sm, md, lg } = props.tokens.primitive.shadow
  return { none, sm, md, lg }
})
</script>
