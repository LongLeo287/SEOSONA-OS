<template>
  <div class="flex h-full overflow-hidden">
    <!-- Table of Contents Sidebar -->
    <div v-if="headings.length > 0" class="w-64 border-r border-zinc-700 overflow-y-auto p-4 hidden lg:block">
      <h3 class="text-sm font-semibold text-zinc-100 mb-3 uppercase tracking-wider">Contents</h3>
      <nav class="space-y-1">
        <a
          v-for="heading in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          :class="[
            'block text-sm py-1 hover:text-orange-400 transition-colors',
            heading.level === 1 ? 'text-zinc-100 font-medium' : 'text-zinc-400',
            heading.level === 2 ? 'pl-3' : '',
            heading.level === 3 ? 'pl-6' : '',
          ]"
        >
          {{ heading.text }}
        </a>
      </nav>
    </div>

    <!-- Image Gallery Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          @click.self="closeLightbox"
        >
          <!-- Close button -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Counter -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300 font-mono">
            {{ lightboxIndex + 1 }} / {{ galleryImages.length }}
          </div>

          <!-- Prev button -->
          <button
            v-if="galleryImages.length > 1"
            @click="prevImage"
            class="absolute left-4 p-3 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Image -->
          <img
            :src="galleryImages[lightboxIndex]?.src"
            :alt="galleryImages[lightboxIndex]?.alt || 'Image'"
            class="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <!-- Next button -->
          <button
            v-if="galleryImages.length > 1"
            @click="nextImage"
            class="absolute right-4 p-3 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Alt text -->
          <div v-if="galleryImages[lightboxIndex]?.alt" class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-800/80 rounded-lg text-sm text-zinc-300 max-w-md text-center">
            {{ galleryImages[lightboxIndex]?.alt }}
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-zinc-400">Loading markdown content...</div>
      </div>

      <div v-else-if="error" class="p-6 max-w-6xl mx-auto">
        <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {{ error }}
        </div>
      </div>

      <div v-else class="p-6 max-w-6xl mx-auto">
        <!-- Frontmatter Header -->
        <div v-if="frontmatter && Object.keys(frontmatter).length > 0" class="mb-8">
          <div class="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-xl p-5 border border-zinc-700/50 shadow-lg">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Document Info</h3>
            </div>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(value, key) in frontmatter"
                :key="key"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 rounded-lg border border-zinc-700/50"
              >
                <span class="text-xs font-medium text-zinc-500 uppercase">{{ key }}</span>
                <span class="text-sm text-zinc-200">
                  <template v-if="Array.isArray(value)">
                    <span v-for="(v, i) in value" :key="i" class="inline-block px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs mr-1">{{ v }}</span>
                  </template>
                  <template v-else>{{ value }}</template>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="flex gap-2 mb-4 justify-end">
          <button
            @click="copyRawMarkdown"
            class="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Raw
          </button>
          <button
            @click="toggleLineNumbers"
            class="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {{ showLineNumbers ? 'Hide' : 'Show' }} Line Numbers
          </button>
        </div>

        <!-- Rendered Markdown -->
        <div
          class="novel-content mx-auto"
          :class="{ 'with-line-numbers': showLineNumbers }"
          v-html="sanitizedHtml"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import DOMPurify from 'dompurify'
import mermaid from 'mermaid'
import 'highlight.js/styles/tokyo-night-dark.css'

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif'
})

// Simple frontmatter parser (browser-compatible, no Buffer needed)
function parseFrontmatter(content) {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
  const match = content.match(fmRegex)

  if (!match) {
    return { data: {}, content }
  }

  const yamlStr = match[1]
  const body = content.slice(match[0].length)
  const data = {}

  // Simple YAML key-value parser
  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim()
      let value = line.slice(colonIdx + 1).trim()

      // Handle arrays (simple format: [a, b, c])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
      }
      // Remove quotes
      else if ((value.startsWith('"') && value.endsWith('"')) ||
               (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      if (key) data[key] = value
    }
  })

  return { data, content: body }
}

// Resolve image paths in markdown to API URLs
function resolveImagePaths(markdown, assetPath) {
  if (!assetPath) return markdown

  // Get the directory containing the markdown file
  const assetDir = assetPath.substring(0, assetPath.lastIndexOf('/'))

  let result = markdown

  // Pattern 1: /content/blog/images/{slug}/{file} → /api/assets/file/articles/{slug}/images/{slug}/{file}
  result = result.replace(
    /!\[([^\]]*)\]\(\/content\/blog\/images\/([^/]+)\/([^)]+)\)/g,
    (match, alt, slug, file) => `![${alt}](/api/assets/file/articles/${slug}/images/${slug}/${file})`
  )

  // Pattern 2: Relative paths like ./images/foo.png → /api/assets/file/{assetDir}/images/foo.png
  result = result.replace(
    /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
    (match, alt, relPath) => `![${alt}](/api/assets/file/${assetDir}/${relPath})`
  )

  // Pattern 3: Relative paths without ./ like images/foo.png
  result = result.replace(
    /!\[([^\]]*)\]\((?!http|\/|\.\/)(images\/[^)]+)\)/g,
    (match, alt, relPath) => `![${alt}](/api/assets/file/${assetDir}/${relPath})`
  )

  return result
}

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const rawContent = ref('')
const frontmatter = ref({})
const renderedHtml = ref('')
const headings = ref([])
const showLineNumbers = ref(false)
let abortController = null

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const galleryImages = ref([])
const contentRef = ref(null)

// Counter for unique mermaid diagram IDs
let mermaidIdCounter = 0

// Configure marked v17+ with custom renderers
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    // Add IDs to headings for TOC navigation
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const id = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\w]+/g, '-')
      return `<h${depth} id="${id}">${text}</h${depth}>\n`
    },
    // Syntax highlighting for code blocks with line wrapping
    // Special handling for mermaid diagrams
    code({ text, lang }) {
      // Detect mermaid code blocks
      if (lang === 'mermaid') {
        const id = `mermaid-${++mermaidIdCounter}`
        // Return a placeholder div that will be rendered by mermaid
        return `<div class="mermaid-container"><pre class="mermaid" id="${id}">${text}</pre></div>\n`
      }

      let highlighted
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlighted = hljs.highlight(text, { language: lang }).value
        } catch (err) {
          highlighted = text
        }
      } else {
        highlighted = hljs.highlightAuto(text).value
      }
      // Wrap each line in a span for line numbering
      const lines = highlighted.split('\n')
      const wrappedLines = lines.map(line => `<span class="code-line">${line || ' '}</span>`).join('\n')
      return `<pre><code class="hljs language-${lang || 'plaintext'}">${wrappedLines}</code></pre>\n`
    }
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

    rawContent.value = data.content

    // Parse frontmatter
    const parsed = parseFrontmatter(data.content)
    frontmatter.value = parsed.data

    // Resolve image paths before rendering
    const contentWithResolvedImages = resolveImagePaths(parsed.content, props.asset.path)

    // Render markdown
    renderedHtml.value = await marked(contentWithResolvedImages)

    // Extract headings for TOC
    extractHeadings(parsed.content)
  } catch (err) {
    if (err.name === 'AbortError') return
    error.value = err.message
    console.error('Failed to fetch markdown:', err)
  } finally {
    loading.value = false
  }
}

const extractHeadings = (content) => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const matches = [...content.matchAll(headingRegex)]

  headings.value = matches.map(match => ({
    level: match[1].length,
    text: match[2].trim(),
    id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
  }))
}

const copyRawMarkdown = async () => {
  try {
    await navigator.clipboard.writeText(rawContent.value)
    // Could add toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const toggleLineNumbers = () => {
  showLineNumbers.value = !showLineNumbers.value
}

// Lightbox functions
const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.value.length
}

const handleLightboxKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'ArrowRight') nextImage()
}

// Render mermaid diagrams after content loads
const renderMermaidDiagrams = async () => {
  const container = document.querySelector('.novel-content')
  if (!container) return

  const mermaidElements = container.querySelectorAll('.mermaid')
  if (mermaidElements.length === 0) return

  try {
    // Reset mermaid ID counter for fresh render
    mermaidIdCounter = 0
    await mermaid.run({ nodes: mermaidElements })
  } catch (err) {
    console.error('Mermaid rendering error:', err)
  }
}

// Setup click handlers on images after content renders
const setupImageGallery = () => {
  const container = document.querySelector('.novel-content')
  if (!container) return

  const images = container.querySelectorAll('img')
  galleryImages.value = Array.from(images).map(img => ({
    src: img.src,
    alt: img.alt
  }))

  images.forEach((img, index) => {
    img.style.cursor = 'pointer'
    img.addEventListener('click', () => openLightbox(index))
  })
}

// Sanitize rendered HTML before using v-html
// Allow mermaid containers and SVG elements for diagram rendering
const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(renderedHtml.value, {
    ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','a','code','pre','strong','em','blockquote','table','thead','tbody','tr','th','td','img','span','div','svg','g','path','rect','circle','line','polygon','polyline','text','tspan','marker','defs','style','foreignObject'],
    ALLOWED_ATTR: ['href','src','alt','class','target','rel','id','viewBox','width','height','d','fill','stroke','stroke-width','transform','x','y','x1','y1','x2','y2','cx','cy','r','rx','ry','points','marker-end','marker-start','text-anchor','dominant-baseline','font-size','font-family','style','xmlns']
  })
})

// Watch for content changes to setup gallery and render mermaid
watch(renderedHtml, async () => {
  await nextTick()
  setupImageGallery()
  renderMermaidDiagrams()
})

onMounted(() => {
  fetchContent()
  window.addEventListener('keydown', handleLightboxKeydown)
})

onUnmounted(() => {
  if (abortController) abortController.abort()
  window.removeEventListener('keydown', handleLightboxKeydown)
  document.body.style.overflow = ''
})
</script>

<style>
/* Novel Theme - Book-like reading experience (dark mode) */
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.novel-content {
  --text-heading: #e0dcd3;
  --text-primary: #c5c0b8;
  --text-muted: #8a8a8a;
  --accent: #d4a574;
  --accent-hover: #e0b98a;
  --code-bg: #1a1a1a;
  --border: #3a3a3a;
  --bg-secondary: #252525;

  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1.125rem;
  line-height: 1.8;
  max-width: 720px;
}

/* Headings - Serif font for elegance */
.novel-content h1,
.novel-content h2,
.novel-content h3,
.novel-content h4,
.novel-content h5,
.novel-content h6 {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-weight: 700;
  color: var(--text-heading);
  line-height: 1.4;
}

.novel-content h1 {
  font-size: 2rem;
  margin: 0 0 2rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
  text-align: center;
}

.novel-content h2 {
  font-size: 1.5rem;
  margin: 3rem 0 1.5rem;
  text-align: center;
}

.novel-content h3 {
  font-size: 1.25rem;
  margin: 2.5rem 0 1rem;
}

.novel-content h4 {
  font-size: 1.1rem;
  margin: 2rem 0 0.75rem;
}

/* Paragraphs */
.novel-content p {
  margin-bottom: 1.5rem;
}

/* Links */
.novel-content a {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: var(--border);
  text-underline-offset: 3px;
  transition: all 0.2s;
}

.novel-content a:hover {
  color: var(--accent-hover);
  text-decoration-color: var(--accent-hover);
}

/* Lists */
.novel-content ul,
.novel-content ol {
  margin: 1.5rem 0;
  padding-left: 1.75rem;
}

.novel-content li {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.novel-content li > ul,
.novel-content li > ol {
  margin: 0.75rem 0;
}

/* Inline code */
.novel-content code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875em;
  background: var(--code-bg);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  color: var(--accent);
}

/* Code blocks */
.novel-content pre {
  background: var(--code-bg);
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2rem 0;
  border: 1px solid var(--border);
}

.novel-content pre code {
  background: none;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-primary);
}

/* Blockquotes */
.novel-content blockquote {
  border-left: 3px solid var(--accent);
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: 0 8px 8px 0;
  font-style: italic;
}

.novel-content blockquote p {
  color: var(--text-muted);
}

.novel-content blockquote p:last-child {
  margin-bottom: 0;
}

/* Tables */
.novel-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.9375rem;
}

.novel-content th,
.novel-content td {
  padding: 0.875rem 1rem;
  text-align: left;
  border: 1px solid var(--border);
}

.novel-content th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-heading);
}

.novel-content tr:nth-child(even) {
  background: rgba(37, 37, 37, 0.5);
}

/* Images */
.novel-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem auto;
  display: block;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* Horizontal rule */
.novel-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 3rem 0;
}

/* Strong/Bold */
.novel-content strong {
  color: var(--text-heading);
  font-weight: 600;
}

/* Emphasis/Italic */
.novel-content em {
  font-style: italic;
}

/* Task lists (GFM checkboxes) */
.novel-content ul:has(input[type="checkbox"]) {
  list-style: none;
  padding-left: 0;
}

.novel-content input[type="checkbox"] {
  margin-right: 0.625rem;
  accent-color: var(--accent);
}

/* Line numbers for code blocks */
.with-line-numbers pre {
  position: relative;
  padding-left: 3.5rem;
}

.with-line-numbers pre code {
  display: block;
  counter-reset: line;
}

.with-line-numbers pre code .hljs-ln-line {
  display: block;
}

.with-line-numbers pre code::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3rem;
  background: rgba(0, 0, 0, 0.3);
  border-right: 1px solid var(--border);
}

/* Manually add line numbers via CSS counter */
.with-line-numbers pre code {
  counter-reset: line-number;
}

.with-line-numbers pre code > span,
.with-line-numbers pre code .hljs-ln-line::before {
  counter-increment: line-number;
}

/* Line number display via wrapper */
.with-line-numbers .code-line {
  display: block;
  position: relative;
  padding-left: 0.5rem;
}

.with-line-numbers .code-line::before {
  content: counter(line-number);
  counter-increment: line-number;
  position: absolute;
  left: -3rem;
  width: 2.5rem;
  text-align: right;
  color: var(--text-muted);
  font-size: 0.75rem;
  user-select: none;
}

/* Lightbox transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Image hover effect */
.novel-content img {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.novel-content img:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* Mermaid diagram styles */
.novel-content .mermaid-container {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow-x: auto;
}

.novel-content .mermaid {
  display: flex;
  justify-content: center;
}

.novel-content .mermaid svg {
  max-width: 100%;
  height: auto;
}
</style>
