<template>
  <div class="h-full overflow-y-auto flex flex-col bg-black">
    <!-- Video Player -->
    <div class="flex-shrink-0 flex items-center justify-center relative min-h-[50vh] max-h-[70vh]">
      <video
        ref="videoRef"
        :src="videoUrl"
        class="max-w-full max-h-full"
        @loadedmetadata="onVideoLoad"
        @timeupdate="onTimeUpdate"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
        @click="togglePlay"
      ></video>

      <!-- Play/Pause Overlay -->
      <div
        v-if="!isPlaying && !loading"
        class="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
        @click="togglePlay"
      >
        <div class="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-2xl">
          <svg class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- Custom Controls -->
    <div class="bg-zinc-900/95 backdrop-blur border-t border-zinc-700">
      <!-- Progress Bar -->
      <div class="px-4 pt-3">
        <div
          ref="progressBarRef"
          class="relative h-1.5 bg-zinc-700 rounded-full cursor-pointer group"
          @click="seek"
          @mouseenter="showPreview = true"
          @mouseleave="showPreview = false"
        >
          <!-- Buffered -->
          <div
            class="absolute h-full bg-zinc-600 rounded-full"
            :style="{ width: bufferedPercent + '%' }"
          ></div>

          <!-- Progress -->
          <div
            class="absolute h-full bg-orange-500 rounded-full"
            :style="{ width: progressPercent + '%' }"
          ></div>

          <!-- Seek Handle -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            :style="{ left: progressPercent + '%', marginLeft: '-6px' }"
          ></div>
        </div>

        <!-- Time Display -->
        <div class="flex justify-between mt-1 text-xs text-zinc-400 font-mono">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex items-center justify-between px-4 pb-3 pt-2">
        <div class="flex items-center gap-2">
          <!-- Play/Pause -->
          <button
            @click="togglePlay"
            class="p-2 text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
          >
            <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>

          <!-- Volume Control -->
          <div class="flex items-center gap-2 group">
            <button
              @click="toggleMute"
              class="p-2 text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
            >
              <svg v-if="volume === 0 || isMuted" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
              <svg v-else-if="volume < 0.5" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 9v6h4l5 5V4l-5 5H7z" />
              </svg>
              <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="volume"
              @input="updateVolume"
              class="w-0 group-hover:w-20 transition-all duration-200 accent-orange-500"
            />
          </div>

          <!-- Playback Speed -->
          <div class="relative" ref="speedMenuRef">
            <button
              @click="showSpeedMenu = !showSpeedMenu"
              class="px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 rounded transition-colors font-mono"
            >
              {{ playbackRate }}×
            </button>

            <div
              v-if="showSpeedMenu"
              class="absolute bottom-full left-0 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden"
            >
              <button
                v-for="speed in [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]"
                :key="speed"
                @click="setPlaybackRate(speed)"
                :class="[
                  'block w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 transition-colors',
                  playbackRate === speed ? 'text-orange-400' : 'text-zinc-100'
                ]"
              >
                {{ speed }}×
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Download -->
          <button
            @click="downloadVideo"
            class="p-2 text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
            title="Download"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <!-- Fullscreen -->
          <button
            @click="toggleFullscreen"
            class="p-2 text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
            title="Fullscreen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Video Info -->
      <div class="px-4 pb-3 pt-2 border-t border-zinc-800">
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div class="text-zinc-400 mb-1">Duration</div>
            <div class="text-zinc-100 font-mono">{{ formatTime(duration) }}</div>
          </div>
          <div>
            <div class="text-zinc-400 mb-1">Dimensions</div>
            <div class="text-zinc-100 font-mono">{{ videoDimensions }}</div>
          </div>
          <div>
            <div class="text-zinc-400 mb-1">File Size</div>
            <div class="text-zinc-100">{{ formatSize(asset.size_bytes) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const videoRef = ref(null)
const progressBarRef = ref(null)
const speedMenuRef = ref(null)
const isPlaying = ref(false)
const loading = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)
const bufferedPercent = ref(0)
const showSpeedMenu = ref(false)
const showPreview = ref(false)
const videoDimensions = ref('Unknown')

const videoUrl = computed(() => {
  const path = props.asset.path || props.asset.local_path
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api/assets/file/${path}`
})

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const onVideoLoad = (e) => {
  duration.value = e.target.duration
  videoDimensions.value = `${e.target.videoWidth} × ${e.target.videoHeight}`
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime

    // Update buffered
    if (videoRef.value.buffered.length > 0) {
      const buffered = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
      bufferedPercent.value = (buffered / duration.value) * 100
    }
  }
}

const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
  }
}

const seek = (e) => {
  if (videoRef.value && progressBarRef.value) {
    const rect = progressBarRef.value.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.value.currentTime = percent * duration.value
  }
}

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted
    isMuted.value = videoRef.value.muted
  }
}

const updateVolume = () => {
  if (videoRef.value) {
    videoRef.value.volume = volume.value
    isMuted.value = volume.value === 0
  }
}

const setPlaybackRate = (rate) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = rate
    playbackRate.value = rate
    showSpeedMenu.value = false
  }
}

const toggleFullscreen = () => {
  if (videoRef.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.value.requestFullscreen()
    }
  }
}

const downloadVideo = () => {
  const link = document.createElement('a')
  link.href = videoUrl.value
  link.download = props.asset.name
  link.click()
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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
  if (e.key === ' ') {
    e.preventDefault()
    togglePlay()
  } else if (e.key === 'ArrowRight') {
    if (videoRef.value) videoRef.value.currentTime += 5
  } else if (e.key === 'ArrowLeft') {
    if (videoRef.value) videoRef.value.currentTime -= 5
  } else if (e.key === 'f') {
    toggleFullscreen()
  } else if (e.key === 'm') {
    toggleMute()
  }
}

const handleClickOutside = (e) => {
  if (speedMenuRef.value && !speedMenuRef.value.contains(e.target)) {
    showSpeedMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  document.removeEventListener('click', handleClickOutside)
})
</script>
