<template>
  <div class="flex gap-4">
    <!-- Folder Tree Sidebar -->
    <div class="w-56 shrink-0 hidden lg:block">
      <div class="bg-surface rounded-xl border border-border p-3 sticky top-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-semibold text-text-muted uppercase tracking-wider">Folders</h3>
          <span class="text-xs text-text-muted">{{ assetsStore.assets.length }}</span>
        </div>

        <!-- Tree Root -->
        <div class="space-y-0.5">
          <!-- All Assets -->
          <button
            @click="navigateToPath('')"
            :class="[
              'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left',
              !currentPath ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
            ]"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="truncate">All Assets</span>
          </button>

          <!-- Folder Tree -->
          <template v-for="folder in folderTree" :key="folder.path">
            <button
              @click="navigateToPath(folder.path)"
              :class="[
                'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left',
                currentPath === folder.path ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              ]"
            >
              <svg class="w-4 h-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span class="truncate flex-1">{{ folder.name }}</span>
              <span class="text-xs text-text-muted">{{ folder.count }}</span>
            </button>

            <!-- Subfolders (level 2) -->
            <template v-if="folder.children.length && (currentPath === folder.path || currentPath.startsWith(folder.path + '/'))">
              <button
                v-for="sub in folder.children"
                :key="sub.path"
                @click="navigateToPath(sub.path)"
                :class="[
                  'w-full flex items-center gap-2 pl-6 pr-2 py-1.5 rounded-lg text-sm transition-colors text-left',
                  currentPath === sub.path ? 'bg-secondary/20 text-secondary' : 'text-text-muted hover:bg-surface-elevated hover:text-text-secondary'
                ]"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span class="truncate flex-1">{{ sub.name }}</span>
                <span class="text-xs text-text-muted">{{ sub.count }}</span>
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-w-0 space-y-4">
    <!-- Breadcrumb Navigation -->
    <nav v-if="currentPath" class="flex items-center gap-2 text-sm">
      <button
        @click="navigateToPath('')"
        class="text-primary hover:text-primary-hover transition-colors font-medium"
      >
        All Assets
      </button>
      <template v-for="(segment, index) in pathSegments" :key="index">
        <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <button
          v-if="index < pathSegments.length - 1"
          @click="navigateToPath(pathSegments.slice(0, index + 1).join('/'))"
          class="text-primary hover:text-primary-hover transition-colors"
        >
          {{ segment }}
        </button>
        <span v-else class="text-text-primary font-medium">{{ segment }}</span>
      </template>
      <button
        v-if="currentPath"
        @click="navigateToPath('')"
        class="ml-2 p-1 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
        title="Clear path filter"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Folder Chips (top-level folders) -->
    <div v-if="!currentPath && topLevelFolders.length > 1" class="flex flex-wrap gap-2">
      <button
        v-for="folder in topLevelFolders"
        :key="folder.name"
        @click="navigateToPath(folder.name)"
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-elevated hover:bg-border text-text-secondary hover:text-text-primary rounded-lg border border-border transition-colors text-sm"
      >
        <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        {{ folder.name }}
        <span class="text-xs text-text-muted">({{ folder.count }})</span>
      </button>
    </div>

    <!-- Subfolder Chips (when inside a folder) -->
    <div v-if="currentPath && subfolders.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="folder in subfolders"
        :key="folder.name"
        @click="navigateToPath(currentPath + '/' + folder.name)"
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-elevated hover:bg-border text-text-secondary hover:text-text-primary rounded-lg border border-border transition-colors text-sm"
      >
        <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        {{ folder.name }}
        <span class="text-xs text-text-muted">({{ folder.count }})</span>
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-surface rounded-xl border border-border p-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search Input -->
        <div class="flex-1 min-w-[200px] relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search assets..."
            class="w-full pl-10 pr-4 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm"
          />
        </div>

        <!-- Format Filter Pills -->
        <div class="flex items-center gap-1">
          <button
            v-for="fmt in formatFilters"
            :key="fmt.value"
            @click="toggleFormat(fmt.value)"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
              selectedFormats.includes(fmt.value)
                ? `${fmt.activeClass} ring-1 ring-offset-1 ring-offset-background`
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
            ]"
          >
            {{ fmt.label }}
          </button>
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="px-3 py-2 bg-surface-elevated text-text-primary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors text-sm min-w-[140px]"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- View Toggle -->
        <div class="flex items-center bg-surface-elevated rounded-lg border border-border p-0.5">
          <button
            @click="viewMode = 'grid'"
            :class="['p-2 rounded-md transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary']"
            title="Grid View"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'compact'"
            :class="['p-2 rounded-md transition-colors', viewMode === 'compact' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary']"
            title="Compact View"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="['p-2 rounded-md transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary']"
            title="List View"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>

        <!-- Count -->
        <div class="text-xs text-text-muted">
          {{ filteredAssets.length }} assets
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAssets.length === 0" class="text-center py-16 bg-surface rounded-xl border border-border">
      <div class="text-text-muted mb-4">
        <svg class="w-20 h-20 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-text-primary mb-2">No assets found</h3>
      <p class="text-text-secondary text-sm max-w-md mx-auto">
        {{ searchQuery || selectedCategory || selectedFormats.length ? 'Try adjusting your filters' : 'Scan your assets directory to discover marketing assets' }}
      </p>
    </div>

    <!-- Project Cards View (for storyboards folder) -->
    <div v-else-if="showProjectView" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projectGroups"
        :key="project.path"
        class="group bg-surface rounded-xl border border-border overflow-hidden card-glow cursor-pointer"
        @click="project.mainAsset ? handleView(project.mainAsset) : navigateToPath(project.path)"
      >
        <!-- Thumbnail Grid -->
        <div class="aspect-video bg-surface-elevated relative overflow-hidden">
          <div class="grid grid-cols-2 grid-rows-2 h-full">
            <img
              v-for="(img, idx) in project.thumbnails.slice(0, 4)"
              :key="idx"
              :src="`/api/assets/file/${img}`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              v-for="n in Math.max(0, 4 - project.thumbnails.length)"
              :key="'empty-' + n"
              class="bg-surface-elevated"
            ></div>
          </div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-4 py-2 bg-primary text-white rounded-lg font-medium">{{ projectViewLabel }}</span>
          </div>
        </div>
        <!-- Info -->
        <div class="p-4">
          <h3 class="font-semibold text-text-primary truncate mb-2">{{ project.name }}</h3>
          <div class="flex items-center gap-3 text-xs text-text-muted">
            <span v-if="project.imageCount" class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ project.imageCount }} images
            </span>
            <span v-if="project.hasJson" class="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">JSON</span>
            <span v-if="project.hasMd" class="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">MD</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      :class="[
        'grid gap-4',
        isSlideView
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      ]"
    >
      <AssetCard
        v-for="asset in filteredAssets"
        :key="asset.id"
        :asset="asset"
        @view="handleView"
      />
    </div>

    <!-- Compact View -->
    <div v-else-if="viewMode === 'compact'" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      <div
        v-for="asset in filteredAssets"
        :key="asset.id"
        class="group relative aspect-square bg-surface rounded-lg border border-border overflow-hidden cursor-pointer card-glow"
        @click="handleView(asset)"
      >
        <img
          v-if="isImageFormat(asset.format)"
          :src="`/api/assets/file/${asset.path}`"
          :alt="asset.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-surface-elevated">
          <span class="text-[10px] font-bold uppercase text-text-muted">{{ getExt(asset.format) }}</span>
        </div>
        <div class="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="text-xs text-text-primary font-medium truncate px-2">{{ asset.name }}</span>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="bg-surface rounded-xl border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-elevated border-b border-border">
          <tr>
            <th class="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Preview</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Format</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Size</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="asset in filteredAssets"
            :key="asset.id"
            class="hover:bg-surface-elevated transition-colors cursor-pointer"
            @click="handleView(asset)"
          >
            <td class="px-4 py-3">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-elevated flex items-center justify-center">
                <img
                  v-if="isImageFormat(asset.format)"
                  :src="`/api/assets/file/${asset.path}`"
                  :alt="asset.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <span v-else class="text-[10px] font-bold uppercase text-text-muted">{{ getExt(asset.format) }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm text-text-primary font-medium">{{ asset.name }}</span>
            </td>
            <td class="px-4 py-3">
              <span v-if="asset.category" class="text-xs text-secondary font-medium">{{ asset.category }}</span>
              <span v-else class="text-xs text-text-muted">—</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-xs uppercase text-text-muted font-medium">{{ getExt(asset.format) }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-xs text-text-muted">{{ formatSize(asset.size_bytes || asset.size) }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                @click.stop="handleView(asset)"
                class="p-1.5 text-text-muted hover:text-primary transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div><!-- End Main Content -->
  </div><!-- End Flex Container -->
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAssetsStore } from '../../stores/assets'
import AssetCard from './AssetCard.vue'

const assetsStore = useAssetsStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedFormats = ref([])
const viewMode = ref('grid')
const currentPath = ref('')

// Path navigation
const pathSegments = computed(() => {
  if (!currentPath.value) return []
  return currentPath.value.split('/').filter(Boolean)
})

const navigateToPath = (path) => {
  currentPath.value = path
  emit('navigate', path)
}

// Get top-level folders with counts
const topLevelFolders = computed(() => {
  const folderMap = new Map()
  assetsStore.assets.forEach(asset => {
    const path = asset.path || asset.local_path || ''
    const topFolder = path.split('/')[0]
    if (topFolder) {
      folderMap.set(topFolder, (folderMap.get(topFolder) || 0) + 1)
    }
  })
  return Array.from(folderMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// Get subfolders of current path
const subfolders = computed(() => {
  if (!currentPath.value) return []
  const folderMap = new Map()
  const prefix = currentPath.value + '/'

  assetsStore.assets.forEach(asset => {
    const path = asset.path || asset.local_path || ''
    if (path.startsWith(prefix)) {
      const remainder = path.slice(prefix.length)
      const nextSegment = remainder.split('/')[0]
      // Only count if it's a folder (has more segments after)
      if (nextSegment && remainder.includes('/')) {
        folderMap.set(nextSegment, (folderMap.get(nextSegment) || 0) + 1)
      }
    }
  })
  return Array.from(folderMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

// Project-based view (for storyboards, slides, articles, etc.)
const projectFolders = ['storyboards', 'slides', 'articles']
const showProjectView = computed(() => {
  return projectFolders.includes(currentPath.value) && subfolders.value.length > 0
})

// Label for project view hover
const projectViewLabel = computed(() => {
  if (currentPath.value === 'articles') return 'View Article'
  if (currentPath.value === 'slides') return 'View Slides'
  return 'View Storyboard'
})

// Slide view - use wider cards when viewing slides
const isSlideView = computed(() => {
  // In slides folder or subfolder
  if (currentPath.value.startsWith('designs/slides') || currentPath.value === 'slides') {
    return true
  }
  // Majority of filtered assets are slides
  const slideCount = filteredAssets.value.filter(a =>
    (a.formatType || a.format_type) === 'slide'
  ).length
  return slideCount > filteredAssets.value.length * 0.5
})

// Group assets by project folder when in project view
const projectGroups = computed(() => {
  if (!showProjectView.value) return []

  const groups = new Map()
  const prefix = currentPath.value + '/'

  assetsStore.assets.forEach(asset => {
    const path = asset.path || asset.local_path || ''
    if (!path.startsWith(prefix)) return

    const remainder = path.slice(prefix.length)
    const projectName = remainder.split('/')[0]
    if (!projectName) return

    if (!groups.has(projectName)) {
      groups.set(projectName, {
        name: projectName,
        path: `${currentPath.value}/${projectName}`,
        assets: [],
        thumbnails: [],
        imageCount: 0,
        hasJson: false,
        hasMd: false,
        mainAsset: null
      })
    }

    const group = groups.get(projectName)
    group.assets.push(asset)

    const format = asset.format?.toLowerCase()
    if (isImageFormat(format)) {
      group.thumbnails.push(path)
      group.imageCount++
    }
    // Storyboard main assets
    if (format === 'json' && asset.name === 'storyboard') {
      group.hasJson = true
      group.mainAsset = asset
    }
    if (format === 'md' && asset.name === 'storyboard') {
      group.hasMd = true
      if (!group.mainAsset) group.mainAsset = asset
    }
    // Article main assets (any MD file in articles folder)
    if (format === 'md' && currentPath.value === 'articles' && !group.mainAsset) {
      group.hasMd = true
      group.mainAsset = asset
    }
  })

  return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// Build folder tree with 2 levels
const folderTree = computed(() => {
  const tree = []
  const level1Map = new Map() // folder -> { count, children: Map }

  assetsStore.assets.forEach(asset => {
    const path = asset.path || asset.local_path || ''
    const segments = path.split('/')
    if (segments.length < 2) return

    const l1 = segments[0]
    if (!level1Map.has(l1)) {
      level1Map.set(l1, { count: 0, childrenMap: new Map() })
    }
    const l1Data = level1Map.get(l1)
    l1Data.count++

    // Level 2
    if (segments.length >= 3) {
      const l2 = segments[1]
      l1Data.childrenMap.set(l2, (l1Data.childrenMap.get(l2) || 0) + 1)
    }
  })

  // Convert to array
  for (const [name, data] of level1Map.entries()) {
    const children = Array.from(data.childrenMap.entries())
      .map(([subName, count]) => ({
        name: subName,
        path: `${name}/${subName}`,
        count
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    tree.push({
      name,
      path: name,
      count: data.count,
      children
    })
  }

  return tree.sort((a, b) => b.count - a.count)
})

const formatFilters = [
  { value: 'image', label: 'Images', activeClass: 'bg-green-500/20 text-green-400 ring-green-500' },
  { value: 'video', label: 'Videos', activeClass: 'bg-primary/20 text-primary ring-primary' },
  { value: 'document', label: 'Docs', activeClass: 'bg-secondary/20 text-secondary ring-secondary' },
  { value: 'code', label: 'Code', activeClass: 'bg-accent/20 text-accent ring-accent' }
]

const categories = computed(() => {
  const cats = new Set()
  assetsStore.assets.forEach(asset => {
    if (asset.category) cats.add(asset.category)
  })
  return Array.from(cats).sort()
})

const getFormatType = (format) => {
  if (!format) return 'file'
  const ext = format.replace('.', '').toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video'
  if (['md', 'txt', 'pdf', 'doc', 'docx', 'rtf'].includes(ext)) return 'document'
  if (['js', 'ts', 'jsx', 'tsx', 'vue', 'py', 'json', 'html', 'css', 'scss', 'yaml', 'yml', 'sh'].includes(ext)) return 'code'
  return 'file'
}

const isImageFormat = (format) => getFormatType(format) === 'image'

const getExt = (format) => format ? format.replace('.', '') : '?'

const filteredAssets = computed(() => {
  let results = assetsStore.assets

  // Path filter (folder navigation)
  if (currentPath.value) {
    const prefix = currentPath.value + '/'
    results = results.filter(asset => {
      const assetPath = asset.path || asset.local_path || ''
      return assetPath.startsWith(prefix)
    })
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(asset =>
      asset.name?.toLowerCase().includes(query) ||
      asset.path?.toLowerCase().includes(query) ||
      asset.category?.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    results = results.filter(asset => asset.category === selectedCategory.value)
  }

  // Format filter
  if (selectedFormats.value.length > 0) {
    results = results.filter(asset =>
      selectedFormats.value.includes(getFormatType(asset.format))
    )
  }

  return results
})

const toggleFormat = (format) => {
  const index = selectedFormats.value.indexOf(format)
  if (index === -1) {
    selectedFormats.value.push(format)
  } else {
    selectedFormats.value.splice(index, 1)
  }
}

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const props = defineProps({
  folder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['view', 'navigate'])

// Sync currentPath with prop
watch(() => props.folder, (newFolder) => {
  if (currentPath.value !== newFolder) {
    currentPath.value = newFolder
  }
}, { immediate: true })

const handleView = (asset) => {
  emit('view', asset)
}
</script>
