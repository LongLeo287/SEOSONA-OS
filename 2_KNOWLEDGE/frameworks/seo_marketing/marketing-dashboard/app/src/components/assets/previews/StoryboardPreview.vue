<template>
  <div class="h-full flex flex-col bg-zinc-950 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 bg-zinc-900/95 border-b border-zinc-700">
      <div v-if="storyboard">
        <h2 class="text-xl font-semibold text-zinc-100">{{ storyboard.title }}</h2>
        <div class="flex items-center gap-4 mt-1 text-sm text-zinc-400">
          <span>{{ storyboard.platform }}</span>
          <span>{{ storyboard.aspect_ratio }}</span>
          <span>{{ formatDuration(storyboard.total_duration) }}</span>
          <span>{{ storyboard.scenes?.length || 0 }} scenes</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="downloadJson"
          class="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download JSON
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="p-6 max-w-6xl mx-auto">
        <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {{ error }}
        </div>
      </div>

      <div v-else-if="storyboard" class="p-6 max-w-6xl mx-auto">
        <!-- Art Style Card -->
        <div v-if="storyboard.art_style" class="mb-8 bg-zinc-900/50 rounded-xl p-5 border border-zinc-700/50">
          <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Art Style</h3>
          <div class="flex items-start gap-6">
            <div class="flex-1">
              <p class="text-lg text-zinc-100 font-medium mb-2">{{ storyboard.art_style.name }}</p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="keyword in storyboard.art_style.keywords"
                  :key="keyword"
                  class="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            <!-- Color Palette -->
            <div v-if="storyboard.art_style.color_palette" class="flex gap-2">
              <div
                v-for="color in getAllColors(storyboard.art_style.color_palette)"
                :key="color"
                class="w-8 h-8 rounded-lg shadow-inner"
                :style="{ backgroundColor: color }"
                :title="color"
              ></div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-700"></div>

          <!-- Scenes -->
          <div
            v-for="scene in storyboard.scenes"
            :key="scene.scene_num"
            class="relative pl-16 pb-8"
          >
            <!-- Timeline Dot -->
            <div class="absolute left-4 top-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {{ scene.scene_num }}
            </div>

            <!-- Scene Card -->
            <div class="bg-zinc-900/80 rounded-xl border border-zinc-700/50 overflow-hidden">
              <!-- Scene Header -->
              <div class="px-5 py-4 border-b border-zinc-700/50">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-zinc-100">{{ scene.name }}</h4>
                    <div class="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                      <span class="font-mono">{{ scene.timing }}</span>
                      <span class="px-2 py-0.5 bg-zinc-800 rounded text-xs">{{ scene.shot_type }}</span>
                      <span class="text-zinc-500">{{ scene.duration }}s</span>
                    </div>
                  </div>
                  <div v-if="scene.motion" class="text-xs text-zinc-500 max-w-48 text-right">
                    {{ scene.motion }}
                  </div>
                </div>
              </div>

              <!-- Frames -->
              <div class="grid grid-cols-2 gap-4 p-5">
                <!-- Start Frame -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 text-sm text-zinc-400">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    Start Frame
                  </div>
                  <div
                    v-if="getFrameImage(scene, 'start')"
                    class="aspect-video bg-zinc-800 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="getFrameImage(scene, 'start')"
                      :alt="`Scene ${scene.scene_num} start`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div v-else class="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                    No image
                  </div>
                  <p v-if="scene.start_frame?.prompt" class="text-xs text-zinc-500 line-clamp-3">
                    {{ scene.start_frame.prompt }}
                  </p>
                </div>

                <!-- End Frame -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 text-sm text-zinc-400">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    End Frame
                  </div>
                  <div
                    v-if="getFrameImage(scene, 'end')"
                    class="aspect-video bg-zinc-800 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="getFrameImage(scene, 'end')"
                      :alt="`Scene ${scene.scene_num} end`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div v-else class="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                    No image
                  </div>
                  <p v-if="scene.end_frame?.prompt" class="text-xs text-zinc-500 line-clamp-3">
                    {{ scene.end_frame.prompt }}
                  </p>
                </div>
              </div>

              <!-- Audio Section -->
              <div v-if="scene.audio" class="px-5 py-4 bg-zinc-800/50 border-t border-zinc-700/50">
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <!-- Voiceover -->
                  <div v-if="scene.audio.voiceover" class="col-span-2">
                    <div class="text-zinc-500 text-xs uppercase mb-1">Voiceover</div>
                    <p class="text-zinc-300 italic">"{{ scene.audio.voiceover }}"</p>
                  </div>

                  <!-- Music & SFX -->
                  <div class="space-y-2">
                    <div v-if="scene.audio.music">
                      <div class="text-zinc-500 text-xs uppercase mb-1">Music</div>
                      <p class="text-zinc-400 text-xs">{{ scene.audio.music.description }}</p>
                      <span class="text-zinc-500 text-xs">{{ scene.audio.music.bpm }} BPM</span>
                    </div>
                    <div v-if="scene.audio.sfx?.length">
                      <div class="text-zinc-500 text-xs uppercase mb-1">SFX</div>
                      <div class="space-y-0.5">
                        <div
                          v-for="(sfx, i) in scene.audio.sfx"
                          :key="i"
                          class="text-zinc-400 text-xs"
                        >
                          <span class="font-mono text-zinc-500">{{ sfx.timestamp }}</span>
                          {{ sfx.sound }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Review Notes -->
              <div v-if="scene.review_notes" class="px-5 py-3 bg-amber-900/20 border-t border-amber-500/20">
                <p class="text-amber-300/80 text-xs">
                  <span class="font-semibold">Note:</span> {{ scene.review_notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const storyboard = ref(null)
const rawJson = ref('')
const assetDir = ref('')

const fetchStoryboard = async () => {
  try {
    loading.value = true
    error.value = null

    const path = props.asset.path || props.asset.local_path
    assetDir.value = path.substring(0, path.lastIndexOf('/'))
    const format = props.asset.format?.toLowerCase()

    // For JSON files, load directly
    if (format === 'json') {
      const response = await fetch(`/api/assets/${props.asset.id}/content`)
      if (!response.ok) throw new Error('Failed to load storyboard')
      const data = await response.json()
      rawJson.value = data.content
      storyboard.value = JSON.parse(data.content)
      return
    }

    // For MD files, try to load sibling storyboard.json
    const jsonPath = `${assetDir.value}/storyboard.json`
    try {
      const response = await fetch(`/api/assets/file/${jsonPath}`)
      if (response.ok) {
        const jsonContent = await response.text()
        rawJson.value = jsonContent
        storyboard.value = JSON.parse(jsonContent)
        return
      }
    } catch {
      // JSON not found, continue with MD fallback
    }

    // Fallback: no storyboard.json, show error
    error.value = 'No storyboard.json found in folder'
  } catch (err) {
    console.error('Failed to load storyboard:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const getFrameImage = (scene, type) => {
  const frame = type === 'start' ? scene.start_frame : scene.end_frame
  if (!frame?.output_path) return null

  // Convert relative path like ./scene-1-start.png to API URL
  let imagePath = frame.output_path
  if (imagePath.startsWith('./')) {
    imagePath = imagePath.substring(2)
  }

  return `/api/assets/file/${assetDir.value}/${imagePath}`
}

const getAllColors = (palette) => {
  const colors = []
  const extract = (obj) => {
    for (const val of Object.values(obj)) {
      if (typeof val === 'string' && val.startsWith('#')) {
        colors.push(val)
      } else if (Array.isArray(val)) {
        val.forEach(v => { if (typeof v === 'string' && v.startsWith('#')) colors.push(v) })
      } else if (typeof val === 'object') {
        extract(val)
      }
    }
  }
  extract(palette)
  return [...new Set(colors)].slice(0, 8) // Max 8 colors
}

const formatDuration = (seconds) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

const downloadJson = () => {
  if (!rawJson.value) return
  const blob = new Blob([rawJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.asset.name + '.json'
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchStoryboard()
})
</script>
