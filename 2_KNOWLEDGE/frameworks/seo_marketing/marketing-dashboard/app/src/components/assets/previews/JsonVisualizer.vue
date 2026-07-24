<template>
  <div class="h-full flex flex-col bg-zinc-900">
    <!-- Tab Bar -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
      <div class="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-orange-500 text-white shadow-lg'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="copyJson"
          class="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-zinc-400">Loading JSON...</div>
      </div>

      <div v-else-if="error" class="p-6">
        <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {{ error }}
        </div>
      </div>

      <!-- Visual Tab -->
      <div v-else-if="activeTab === 'visual'" class="h-full overflow-y-auto p-6">
        <!-- Auto-detected visualization -->
        <div class="max-w-4xl mx-auto space-y-8">

          <!-- Source/Metadata Card -->
          <div v-if="sourceMetadata && Object.keys(sourceMetadata).length > 0" class="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 border border-zinc-700">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-zinc-100">Info</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <template v-for="(value, key) in sourceMetadata" :key="key">
                <div v-if="!isObject(value)" class="bg-zinc-800/50 rounded-xl p-4">
                  <div class="text-xs text-zinc-500 uppercase tracking-wider mb-1">{{ formatKey(String(key)) }}</div>
                  <div class="text-zinc-100 font-medium truncate" :title="String(value)">
                    <template v-if="isNumber(value)">{{ formatNumber(value) }}</template>
                    <template v-else-if="isUrl(String(value))">
                      <a :href="String(value)" target="_blank" class="text-orange-400 hover:underline">{{ truncate(String(value), 30) }}</a>
                    </template>
                    <template v-else>{{ truncate(String(value), 40) }}</template>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Stats Row (for numeric values) -->
          <div v-if="numericStats.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="stat in numericStats"
              :key="stat.key"
              class="relative overflow-hidden rounded-2xl p-5"
              :class="stat.gradient"
            >
              <div class="relative z-10">
                <div class="text-sm opacity-80 mb-1">{{ stat.label }}</div>
                <div class="text-3xl font-bold">{{ stat.formatted }}</div>
              </div>
              <div class="absolute right-2 bottom-2 opacity-20">
                <component :is="stat.icon" class="w-16 h-16" />
              </div>
            </div>
          </div>

          <!-- Timeline/List Items -->
          <div v-if="listItems.length > 0" class="space-y-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-zinc-100">{{ listItemsTitle }}</h2>
              <span class="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">{{ listItems.length }} items</span>
            </div>

            <div class="relative">
              <!-- Timeline line -->
              <div class="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-purple-500 to-blue-500"></div>

              <!-- Items -->
              <div class="space-y-4">
                <div
                  v-for="(item, index) in listItems"
                  :key="index"
                  class="relative pl-16 group"
                >
                  <!-- Timeline dot -->
                  <div class="absolute left-4 top-6 w-5 h-5 rounded-full bg-zinc-900 border-2 border-orange-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                    <span class="text-[10px] font-bold text-orange-400">{{ item.num || index + 1 }}</span>
                  </div>

                  <!-- Card -->
                  <div class="bg-zinc-800/50 hover:bg-zinc-800 rounded-xl p-5 border border-zinc-700/50 hover:border-zinc-600 transition-all">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-zinc-100 mb-2">{{ item.title || item.name || `Item ${index + 1}` }}</h3>
                        <p v-if="item.summary || item.description" class="text-zinc-400 text-sm leading-relaxed">
                          {{ item.summary || item.description }}
                        </p>
                        <!-- Extra fields -->
                        <div v-if="getExtraFields(item).length > 0" class="flex flex-wrap gap-2 mt-3">
                          <span
                            v-for="field in getExtraFields(item)"
                            :key="field.key"
                            class="px-2 py-1 bg-zinc-700/50 rounded-md text-xs text-zinc-400"
                          >
                            {{ field.key }}: <span class="text-zinc-300">{{ field.value }}</span>
                          </span>
                        </div>
                      </div>
                      <div v-if="item.timestamp" class="shrink-0 px-3 py-1 bg-zinc-700/50 rounded-lg text-sm font-mono text-zinc-400">
                        {{ item.timestamp }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Key-Value Pairs (for simple objects) -->
          <div v-if="keyValuePairs.length > 0" class="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <h2 class="text-lg font-semibold text-zinc-100 mb-4">Properties</h2>
            <div class="space-y-3">
              <div
                v-for="pair in keyValuePairs"
                :key="pair.key"
                class="flex items-center justify-between py-2 border-b border-zinc-700/50 last:border-0"
              >
                <span class="text-zinc-400">{{ pair.key }}</span>
                <span class="text-zinc-100 font-medium">{{ pair.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tree Tab -->
      <div v-else-if="activeTab === 'tree'" class="h-full overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto">
          <div class="bg-zinc-800/50 rounded-xl p-4 font-mono text-sm">
            <JsonTreeNode :data="jsonData" :name="'root'" :depth="0" />
          </div>
        </div>
      </div>

      <!-- Code Tab -->
      <div v-else-if="activeTab === 'code'" class="h-full overflow-y-auto">
        <pre class="p-6 text-sm font-mono"><code v-html="highlightedJson"></code></pre>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="px-4 py-3 border-t border-zinc-700 bg-zinc-800/50">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-6">
          <div>
            <span class="text-zinc-500">Keys:</span>
            <span class="text-zinc-300 ml-2 font-mono">{{ keyCount }}</span>
          </div>
          <div>
            <span class="text-zinc-500">Depth:</span>
            <span class="text-zinc-300 ml-2 font-mono">{{ maxDepth }}</span>
          </div>
          <div>
            <span class="text-zinc-500">Size:</span>
            <span class="text-zinc-300 ml-2">{{ formatSize(rawContent.length) }}</span>
          </div>
        </div>
        <div class="text-zinc-500">
          {{ asset.name }}.json
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h, defineComponent } from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/tokyo-night-dark.css'

hljs.registerLanguage('json', json)

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const rawContent = ref('')
const jsonData = ref({})
const activeTab = ref('visual')
const copied = ref(false)

// Tabs configuration
const tabs = [
  {
    id: 'visual',
    name: 'Visual',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ])
  },
  {
    id: 'tree',
    name: 'Tree',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
    ])
  },
  {
    id: 'code',
    name: 'Code',
    icon: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })
    ])
  }
]

// Compute stats
const keyCount = computed(() => {
  return countKeys(jsonData.value)
})

const maxDepth = computed(() => {
  return getMaxDepth(jsonData.value)
})

// Extract source/metadata, handling both object and primitive cases
const sourceMetadata = computed(() => {
  const data = jsonData.value
  const result = {}

  // Collect top-level non-array, non-complex-object fields
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) continue
    if (typeof value === 'object' && value !== null) {
      // If it's a simple object (like stats), flatten it
      if (key === 'source' || key === 'metadata' || key === 'stats') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (!isObject(subValue)) {
            result[subKey] = subValue
          }
        }
      }
      continue
    }
    // Add primitive values
    result[key] = value
  }

  return result
})

// Extract numeric stats for cards
const numericStats = computed(() => {
  const stats = []
  const gradients = [
    'bg-gradient-to-br from-orange-500 to-red-600 text-white',
    'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    'bg-gradient-to-br from-green-500 to-teal-600 text-white',
    'bg-gradient-to-br from-pink-500 to-rose-600 text-white'
  ]
  const icons = [
    h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }), h('path', { d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })]),
    h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })]),
    h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })]),
    h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })])
  ]

  // Look for numeric values in stats object or source object
  const searchObjects = [
    jsonData.value.stats,
    typeof jsonData.value.source === 'object' ? jsonData.value.source : null,
    jsonData.value.metadata
  ].filter(Boolean)

  let i = 0
  for (const obj of searchObjects) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'number' && i < 4) {
        stats.push({
          key,
          label: formatKey(String(key)),
          value,
          formatted: formatNumber(value),
          gradient: gradients[i % gradients.length],
          icon: icons[i % icons.length]
        })
        i++
      }
    }
  }

  return stats
})

// Extract list items (arrays with objects)
const listItems = computed(() => {
  for (const [key, value] of Object.entries(jsonData.value)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return value
    }
  }
  return []
})

const listItemsTitle = computed(() => {
  for (const [key, value] of Object.entries(jsonData.value)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return formatKey(key)
    }
  }
  return 'Items'
})

// Key-value pairs for simple objects
const keyValuePairs = computed(() => {
  const pairs = []
  const skip = ['source', 'metadata', 'infographic']

  for (const [key, value] of Object.entries(jsonData.value)) {
    if (skip.includes(key)) continue
    if (Array.isArray(value)) continue
    if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (!isObject(subValue)) {
          pairs.push({ key: `${formatKey(key)}.${formatKey(subKey)}`, value: String(subValue) })
        }
      }
    } else {
      pairs.push({ key: formatKey(key), value: String(value) })
    }
  }

  return pairs.slice(0, 10) // Limit to 10
})

// Highlighted JSON for code view
const highlightedJson = computed(() => {
  try {
    const formatted = JSON.stringify(jsonData.value, null, 2)
    return hljs.highlight(formatted, { language: 'json' }).value
  } catch {
    return rawContent.value
  }
})

// Helper functions
function countKeys(obj, count = 0) {
  if (typeof obj !== 'object' || obj === null) return count
  for (const key of Object.keys(obj)) {
    count++
    if (typeof obj[key] === 'object') {
      count = countKeys(obj[key], count)
    }
  }
  return count
}

function getMaxDepth(obj, depth = 0) {
  if (typeof obj !== 'object' || obj === null) return depth
  let maxD = depth
  for (const value of Object.values(obj)) {
    if (typeof value === 'object') {
      maxD = Math.max(maxD, getMaxDepth(value, depth + 1))
    }
  }
  return maxD
}

function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^\w/, c => c.toUpperCase()).trim()
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function isObject(val) {
  return typeof val === 'object' && val !== null
}

function isNumber(val) {
  return typeof val === 'number'
}

function isUrl(val) {
  return typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '...' : str
}

function getExtraFields(item) {
  const skip = ['num', 'title', 'name', 'summary', 'description', 'timestamp']
  return Object.entries(item)
    .filter(([key, value]) => !skip.includes(key) && !isObject(value))
    .map(([key, value]) => ({ key: formatKey(key), value: truncate(String(value), 20) }))
    .slice(0, 3)
}

async function fetchContent() {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`/api/assets/${props.asset.id}/content`)
    if (!response.ok) throw new Error('Failed to load content')

    const data = await response.json()
    rawContent.value = data.content

    try {
      jsonData.value = JSON.parse(data.content)
    } catch {
      error.value = 'Invalid JSON format'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(jsonData.value, null, 2))
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

onMounted(fetchContent)

// Tree Node Component
const JsonTreeNode = defineComponent({
  name: 'JsonTreeNode',
  props: {
    data: { required: true },
    name: { type: String, default: '' },
    depth: { type: Number, default: 0 }
  },
  setup(props) {
    const expanded = ref(props.depth < 2)

    const isExpandable = computed(() => {
      return typeof props.data === 'object' && props.data !== null
    })

    const displayValue = computed(() => {
      if (props.data === null) return 'null'
      if (typeof props.data === 'string') return `"${props.data}"`
      if (typeof props.data === 'number' || typeof props.data === 'boolean') return String(props.data)
      if (Array.isArray(props.data)) return `Array[${props.data.length}]`
      return `Object{${Object.keys(props.data).length}}`
    })

    const valueClass = computed(() => {
      if (props.data === null) return 'text-zinc-500'
      if (typeof props.data === 'string') return 'text-green-400'
      if (typeof props.data === 'number') return 'text-blue-400'
      if (typeof props.data === 'boolean') return 'text-purple-400'
      return 'text-zinc-400'
    })

    return () => {
      const toggleBtn = isExpandable.value ? h('button', {
        onClick: () => { expanded.value = !expanded.value },
        class: 'mr-1 text-zinc-500 hover:text-zinc-300 w-4'
      }, expanded.value ? '▼' : '▶') : h('span', { class: 'w-4 inline-block' })

      const keySpan = props.name && props.name !== 'root' ? h('span', { class: 'text-orange-400' }, `"${props.name}": `) : null

      const valueSpan = !isExpandable.value || !expanded.value
        ? h('span', { class: valueClass.value }, displayValue.value)
        : null

      const children = isExpandable.value && expanded.value
        ? h('div', { class: 'ml-4 border-l border-zinc-700 pl-2' },
            Object.entries(props.data).map(([key, val]) =>
              h(JsonTreeNode, { data: val, name: key, depth: props.depth + 1, key })
            )
          )
        : null

      return h('div', { class: 'py-0.5' }, [
        h('div', { class: 'flex items-start' }, [toggleBtn, keySpan, valueSpan]),
        children
      ])
    }
  }
})
</script>

<style>
pre code.hljs {
  background: transparent;
}
</style>
