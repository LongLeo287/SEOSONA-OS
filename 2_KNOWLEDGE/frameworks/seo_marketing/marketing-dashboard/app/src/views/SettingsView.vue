<template>
  <div>
    <div class="mb-6">
      <h2 class="text-3xl font-heading font-bold text-gradient">Settings</h2>
      <p class="mt-2 text-sm text-text-secondary">Configure your marketing dashboard</p>
    </div>

    <div class="space-y-6">
      <div class="bg-surface rounded-xl border border-border p-6">
        <h3 class="text-lg font-heading font-semibold text-text-primary mb-4">API Configuration</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              API Key
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="apiKey"
                type="password"
                placeholder="Enter your API key"
                class="flex-1 px-3 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <button
                @click="saveApiKey"
                class="px-4 py-2 text-sm font-medium text-white btn-gradient rounded-lg"
              >
                Save
              </button>
            </div>
            <p class="mt-2 text-sm text-text-secondary">
              Required for API authentication. {{ apiKeyStatus }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-primary mb-2">
              API Base URL
            </label>
            <input
              v-model="apiBase"
              type="text"
              class="w-full px-3 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
            <p class="mt-2 text-sm text-text-secondary">
              Default: http://localhost:3457/api
            </p>
          </div>
        </div>
      </div>

      <div class="bg-surface rounded-xl border border-border p-6">
        <h3 class="text-lg font-heading font-semibold text-text-primary mb-4">Storage</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-border">
            <span class="text-sm font-medium text-text-primary">Database</span>
            <span class="text-sm text-text-secondary">SQLite (Local)</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-border">
            <span class="text-sm font-medium text-text-primary">Assets Location</span>
            <span class="text-sm text-text-secondary">../../../../assets</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm font-medium text-text-primary">API Key Storage</span>
            <span class="text-sm text-text-secondary">LocalStorage</span>
          </div>
        </div>
      </div>

      <div class="bg-surface rounded-xl border border-border p-6">
        <h3 class="text-lg font-heading font-semibold text-text-primary mb-4">About</h3>
        <div class="space-y-2 text-sm text-text-secondary">
          <p><strong class="text-text-primary">Version:</strong> 1.0.0</p>
          <p><strong class="text-text-primary">Framework:</strong> Vue 3 + Vite</p>
          <p><strong class="text-text-primary">Server:</strong> Hono + SQLite</p>
          <p><strong class="text-text-primary">Phase:</strong> 3 - Vue Components</p>
        </div>
      </div>
    </div>

    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Toast from '../components/common/Toast.vue'

const apiKey = ref('')
const apiBase = ref('http://localhost:3457/api')
const toast = ref({ show: false, message: '', type: 'success' })

const apiKeyStatus = computed(() => {
  return sessionStorage.getItem('api_key') ? 'Currently set' : 'Not set'
})

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

function saveApiKey() {
  if (apiKey.value) {
    sessionStorage.setItem('api_key', apiKey.value)
    apiKey.value = ''
    showToast('API key saved successfully')
  }
}
</script>
