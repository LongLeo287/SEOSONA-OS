<template>
  <div class="h-full flex flex-col bg-zinc-900">
    <!-- Top Action Bar -->
    <div class="flex items-center justify-between p-4 border-b border-zinc-700">
      <div class="flex items-center gap-3">
        <!-- Language Badge -->
        <div class="px-3 py-1 bg-zinc-800 rounded-md text-sm font-mono text-orange-400">
          {{ languageDisplay }}
        </div>

        <!-- Line Count -->
        <div class="text-sm text-zinc-400">
          {{ lineCount }} lines
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Word Wrap Toggle -->
        <button
          @click="wordWrap = !wordWrap"
          :class="[
            'px-3 py-2 text-sm rounded transition-colors',
            wordWrap
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          ]"
        >
          Word Wrap
        </button>

        <!-- Line Numbers Toggle -->
        <button
          @click="showLineNumbers = !showLineNumbers"
          :class="[
            'px-3 py-2 text-sm rounded transition-colors',
            showLineNumbers
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          ]"
        >
          Line Numbers
        </button>

        <!-- Copy All Button -->
        <button
          @click="copyCode"
          class="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ copied ? 'Copied!' : 'Copy All' }}
        </button>

        <!-- Download Button -->
        <button
          @click="downloadFile"
          class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
          title="Download"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div v-if="showSearch" class="px-4 py-3 border-b border-zinc-700 bg-zinc-800/50">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search in file... (Ctrl+F)"
          class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm placeholder-zinc-500"
          @keydown.escape="closeSearch"
        />
        <div class="text-xs text-zinc-400">
          {{ searchMatches.length > 0 ? `${currentMatchIndex + 1} of ${searchMatches.length}` : 'No matches' }}
        </div>
        <button
          @click="previousMatch"
          class="p-1 text-zinc-400 hover:text-zinc-100 rounded"
          :disabled="searchMatches.length === 0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          @click="nextMatch"
          class="p-1 text-zinc-400 hover:text-zinc-100 rounded"
          :disabled="searchMatches.length === 0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button @click="closeSearch" class="p-1 text-zinc-400 hover:text-zinc-100 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Code Display -->
    <div class="flex-1 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-zinc-400">Loading code...</div>
      </div>

      <div v-else-if="error" class="p-6">
        <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {{ error }}
        </div>
      </div>

      <div
        v-else
        ref="codeContainerRef"
        class="h-full overflow-auto"
        :class="{ 'whitespace-pre-wrap': wordWrap, 'whitespace-pre': !wordWrap }"
      >
        <pre
          class="p-4 text-sm font-mono"
          :class="{ 'line-numbers': showLineNumbers }"
        ><code v-html="highlightedCode" class="language-" :class="`language-${language}`"></code></pre>
      </div>
    </div>

    <!-- Bottom Stats Bar -->
    <div class="px-4 py-3 border-t border-zinc-700 bg-zinc-800/50">
      <div class="grid grid-cols-4 gap-4 text-sm">
        <div>
          <div class="text-zinc-400 mb-1">Language</div>
          <div class="text-zinc-100">{{ languageDisplay }}</div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">Lines</div>
          <div class="text-zinc-100 font-mono">{{ lineCount }}</div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">File Size</div>
          <div class="text-zinc-100">{{ formatSize(asset.size_bytes) }}</div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">Encoding</div>
          <div class="text-zinc-100">UTF-8</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/tokyo-night-dark.css'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const rawCode = ref('')
const showLineNumbers = ref(true)
const wordWrap = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchMatches = ref([])
const currentMatchIndex = ref(0)
const copied = ref(false)
const searchInputRef = ref(null)
const codeContainerRef = ref(null)
let abortController = null

const language = computed(() => {
  const ext = props.asset.format.toLowerCase()
  const langMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    sh: 'bash',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    xml: 'xml'
  }
  return langMap[ext] || ext
})

const languageDisplay = computed(() => {
  return language.value.toUpperCase()
})

const lineCount = computed(() => {
  return rawCode.value.split('\n').length
})

const highlightedCode = computed(() => {
  if (!rawCode.value) return ''

  try {
    if (hljs.getLanguage(language.value)) {
      return hljs.highlight(rawCode.value, { language: language.value }).value
    }
    return hljs.highlightAuto(rawCode.value).value
  } catch (err) {
    console.error('Highlight error:', err)
    return rawCode.value
  }
})

const fetchContent = async () => {
  try {
    loading.value = true
    error.value = null

    abortController = new AbortController()
    const response = await fetch(`/api/assets/${props.asset.id}/content`, {
      signal: abortController.signal
    })
    if (!response.ok) throw new Error('Failed to load content')

    const data = await response.json()

    // Validate response
    if (!data || typeof data.content !== 'string') {
      throw new Error('Invalid response format')
    }

    rawCode.value = data.content
  } catch (err) {
    if (err.name === 'AbortError') return
    error.value = err.message
    console.error('Failed to fetch code:', err)
  } finally {
    loading.value = false
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(rawCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const downloadFile = () => {
  const blob = new Blob([rawCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = props.asset.name
  link.click()
  URL.revokeObjectURL(url)
}

const openSearch = () => {
  showSearch.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
  searchMatches.value = []
  currentMatchIndex.value = 0
}

const performSearch = () => {
  searchMatches.value = []
  if (!searchQuery.value) return

  const lines = rawCode.value.split('\n')
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      searchMatches.value.push(index)
    }
  })

  if (searchMatches.value.length > 0) {
    scrollToMatch(0)
  }
}

const scrollToMatch = (index) => {
  currentMatchIndex.value = index
  // Implement scroll to line logic here
}

const nextMatch = () => {
  if (searchMatches.value.length === 0) return
  const next = (currentMatchIndex.value + 1) % searchMatches.value.length
  scrollToMatch(next)
}

const previousMatch = () => {
  if (searchMatches.value.length === 0) return
  const prev = (currentMatchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length
  scrollToMatch(prev)
}

const formatSize = (bytes) => {
  if (!bytes) return 'Unknown'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const handleKeyPress = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault()
    openSearch()
  }
}

// Watch search query
import { watch } from 'vue'
watch(searchQuery, performSearch)

onMounted(() => {
  fetchContent()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  if (abortController) abortController.abort()
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
/* Line numbers styling */
pre.line-numbers {
  counter-reset: line;
}

pre.line-numbers code {
  counter-increment: line;
}

pre.line-numbers code::before {
  content: counter(line);
  display: inline-block;
  width: 3em;
  margin-right: 1em;
  padding-right: 0.5em;
  text-align: right;
  color: #6b7280;
  border-right: 1px solid #374151;
  user-select: none;
}

/* Override highlight.js background */
pre code.hljs {
  background: transparent;
}
</style>
