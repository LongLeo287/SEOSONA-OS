<template>
  <div class="h-full flex bg-zinc-950 overflow-hidden">
    <!-- Chapter Sidebar -->
    <div v-if="chapters.length > 1" class="w-56 shrink-0 border-r border-zinc-700 overflow-y-auto hidden lg:block">
      <div class="p-4">
        <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Chapters</h3>
        <nav class="space-y-1">
          <button
            v-for="(chapter, idx) in chapters"
            :key="idx"
            @click="scrollToChapter(chapter.id)"
            class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
            :class="activeChapter === chapter.id
              ? 'bg-primary/20 text-primary'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'"
          >
            <div class="truncate">{{ chapter.title }}</div>
            <div v-if="chapter.timestamp" class="text-xs text-zinc-500 mt-0.5 font-mono">
              {{ chapter.timestamp }}
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto" ref="contentRef">
      <div class="max-w-3xl mx-auto p-6 lg:p-8">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {{ error }}
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Metadata Card -->
          <div v-if="Object.keys(metadata).length > 0" class="mb-8 bg-zinc-900/80 rounded-xl p-5 border border-zinc-700/50">
            <!-- Title -->
            <h1 v-if="title" class="text-xl font-bold text-zinc-100 mb-4">{{ title }}</h1>

            <!-- YouTube Thumbnail -->
            <div v-if="youtubeId" class="mb-4">
              <a :href="metadata.video" target="_blank" rel="noopener" class="block relative group">
                <img
                  :src="`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`"
                  :alt="title"
                  class="w-full max-w-md rounded-lg"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </a>
            </div>

            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div v-if="metadata.channel">
                <div class="text-zinc-500 text-xs uppercase mb-1">Channel</div>
                <div class="text-zinc-200">{{ metadata.channel }}</div>
              </div>
              <div v-if="metadata.duration">
                <div class="text-zinc-500 text-xs uppercase mb-1">Duration</div>
                <div class="text-zinc-200 font-mono">{{ metadata.duration }}</div>
              </div>
              <div v-if="metadata.views">
                <div class="text-zinc-500 text-xs uppercase mb-1">Views</div>
                <div class="text-zinc-200">{{ metadata.views }}</div>
              </div>
              <div v-if="metadata.likes">
                <div class="text-zinc-500 text-xs uppercase mb-1">Likes</div>
                <div class="text-zinc-200">{{ metadata.likes }}</div>
              </div>
            </div>

            <!-- Video Link -->
            <a
              v-if="metadata.video && !youtubeId"
              :href="metadata.video"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Watch Video
            </a>
          </div>

          <!-- Transcript Content -->
          <div
            class="prose prose-invert prose-zinc max-w-none transcript-content"
            v-html="renderedContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const rawContent = ref('')
const contentRef = ref(null)
const activeChapter = ref(null)

// Detect if content is VTT format
const isVttFormat = computed(() => {
  const format = props.asset?.format?.toLowerCase()
  return format === 'vtt' || format === 'srt' || rawContent.value.trim().startsWith('WEBVTT')
})

// Parse metadata from header (for markdown transcripts)
const metadata = computed(() => {
  if (isVttFormat.value) return {}

  const meta = {}
  const lines = rawContent.value.split('\n')

  for (const line of lines) {
    if (line.startsWith('---')) break

    // Match **Key:** Value pattern
    const match = line.match(/^\*\*([^:]+):\*\*\s*(.+)$/)
    if (match) {
      const key = match[1].toLowerCase().trim()
      let value = match[2].trim()

      // Extract link if present
      const linkMatch = value.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        value = linkMatch[2] // Use URL
      }

      meta[key] = value
    }
  }

  return meta
})

// Extract title from first # heading
const title = computed(() => {
  const match = rawContent.value.match(/^#\s+(.+)$/m)
  return match ? match[1] : null
})

// Extract YouTube video ID
const youtubeId = computed(() => {
  const url = metadata.value.video
  if (!url) return null

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
})

// Extract chapters from ## headings
const chapters = computed(() => {
  const chaps = []
  const regex = /^##\s+(.+)$/gm
  let match

  while ((match = regex.exec(rawContent.value)) !== null) {
    const title = match[1]
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Check for timestamp in next line
    const afterMatch = rawContent.value.slice(match.index + match[0].length, match.index + match[0].length + 50)
    const tsMatch = afterMatch.match(/\*\*\[(\d+:\d+)\]\*\*/)

    chaps.push({
      title,
      id,
      timestamp: tsMatch ? tsMatch[1] : null
    })
  }

  return chaps
})

// Parse VTT format content
const parseVttContent = (content) => {
  const lines = content.split('\n')
  const entries = []
  let currentEntry = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Match timestamp pattern: [at X.XX seconds]
    const tsMatch = trimmed.match(/^\[at\s+([\d.]+)\s+seconds?\]/i)
    if (tsMatch) {
      const seconds = parseFloat(tsMatch[1])
      const text = trimmed.replace(/^\[at\s+[\d.]+\s+seconds?\]\s*/i, '').trim()
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      const timestamp = `${mins}:${secs.toString().padStart(2, '0')}`

      entries.push({
        timestamp,
        seconds,
        text: text.replace(/&#39;/g, "'").replace(/&amp;/g, '&')
      })
    }
  }

  // Group consecutive entries into paragraphs
  let html = '<div class="vtt-transcript">'
  for (const entry of entries) {
    if (entry.text === '[Music]') {
      html += `<div class="vtt-music"><span class="timestamp">[${entry.timestamp}]</span> 🎵 Music</div>`
    } else {
      html += `<p><span class="timestamp">[${entry.timestamp}]</span> ${entry.text}</p>`
    }
  }
  html += '</div>'

  return html
}

// Render content with enhanced timestamps
const renderedContent = computed(() => {
  if (!rawContent.value) return ''

  // Handle VTT format
  if (isVttFormat.value) {
    return parseVttContent(rawContent.value)
  }

  // Remove metadata section (before first ---)
  let content = rawContent.value
  const firstHr = content.indexOf('---')
  if (firstHr > 0 && firstHr < 500) {
    content = content.slice(firstHr)
  }

  // Add IDs to ## headings for navigation
  content = content.replace(/^##\s+(.+)$/gm, (match, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `<h2 id="${id}">${title}</h2>`
  })

  // Style timestamps
  content = content.replace(/\*\*\[(\d+:\d+)\]\*\*/g, '<span class="timestamp">[$1]</span>')

  // Parse remaining markdown
  const html = marked.parse(content)

  return html
})

// Scroll to chapter
const scrollToChapter = (id) => {
  const el = contentRef.value?.querySelector(`#${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeChapter.value = id
  }
}

// Fetch content
const fetchContent = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`/api/assets/${props.asset.id}/content`)
    if (!response.ok) throw new Error('Failed to load transcript')

    const data = await response.json()
    rawContent.value = data.content
  } catch (err) {
    console.error('Failed to load transcript:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchContent()
})
</script>

<style scoped>
.transcript-content :deep(.timestamp) {
  display: inline-block;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.transcript-content :deep(h2) {
  scroll-margin-top: 2rem;
}

.transcript-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.transcript-content :deep(hr) {
  margin: 2rem 0;
  border-color: rgba(63, 63, 70, 0.5);
}

/* VTT transcript styles */
.transcript-content :deep(.vtt-transcript) {
  line-height: 1.8;
}

.transcript-content :deep(.vtt-transcript p) {
  margin-bottom: 0.75rem;
  color: #e4e4e7;
}

.transcript-content :deep(.vtt-music) {
  color: #9ca3af;
  font-style: italic;
  margin: 1.5rem 0;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.5rem;
}
</style>
