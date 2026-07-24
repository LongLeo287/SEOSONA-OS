<template>
  <div class="bg-surface border border-border rounded-xl p-6">
    <h3 class="text-lg font-heading font-semibold mb-4">Typography</h3>

    <div v-if="!tokens" class="text-text-secondary">Loading typography...</div>

    <div v-else class="space-y-8">
      <!-- Font Families -->
      <div class="space-y-4">
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wider mb-2">Heading Font</p>
          <p :style="{ fontFamily: tokens.semantic.typography['font-heading'].$value }" class="text-3xl">
            Aa Bb Cc 123 !@#
          </p>
          <p class="text-xs font-mono text-text-muted mt-1">
            {{ tokens.semantic.typography['font-heading'].$value }}
          </p>
        </div>

        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wider mb-2">Body Font</p>
          <p :style="{ fontFamily: tokens.semantic.typography['font-body'].$value }" class="text-3xl">
            Aa Bb Cc 123 !@#
          </p>
          <p class="text-xs font-mono text-text-muted mt-1">
            {{ tokens.semantic.typography['font-body'].$value }}
          </p>
        </div>

        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wider mb-2">Monospace Font</p>
          <p :style="{ fontFamily: tokens.semantic.typography['font-mono'].$value }" class="text-3xl">
            Aa Bb Cc 123 !@#
          </p>
          <p class="text-xs font-mono text-text-muted mt-1">
            {{ tokens.semantic.typography['font-mono'].$value }}
          </p>
        </div>
      </div>

      <!-- Font Sizes -->
      <div>
        <p class="text-xs text-text-secondary uppercase tracking-wider mb-3">Font Size Scale</p>
        <div class="space-y-2">
          <div
            v-for="(size, key) in tokens.primitive.fontSize"
            :key="key"
            class="flex items-baseline gap-4"
          >
            <span class="text-xs text-text-muted w-12">{{ key }}</span>
            <span
              :style="{ fontSize: size.$value }"
              class="font-body"
            >
              The quick brown fox
            </span>
            <span class="text-xs font-mono text-text-secondary ml-auto">
              {{ size.$value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Font Weights -->
      <div>
        <p class="text-xs text-text-secondary uppercase tracking-wider mb-3">Font Weight Scale</p>
        <div class="space-y-2">
          <div
            v-for="(weight, key) in tokens.primitive.fontWeight"
            :key="key"
            class="flex items-baseline gap-4"
          >
            <span class="text-xs text-text-muted w-20">{{ key }}</span>
            <span
              :style="{ fontWeight: weight.$value }"
              class="text-xl font-body"
            >
              The quick brown fox jumps over the lazy dog
            </span>
            <span class="text-xs font-mono text-text-secondary ml-auto">
              {{ weight.$value }}
            </span>
          </div>
        </div>
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
