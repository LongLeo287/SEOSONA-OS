<template>
  <aside
    class="bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo Section -->
    <div class="px-3 py-4 border-b border-border flex items-center" :class="collapsed ? 'justify-center' : 'justify-between'">
      <div class="flex items-center" :class="collapsed ? '' : 'space-x-3'">
        <img src="/ck-logo.png" alt="ClaudeKit" class="w-8 h-8 flex-shrink-0" />
        <h1 v-if="!collapsed" class="text-lg font-heading font-bold text-gradient whitespace-nowrap">ClaudeKit</h1>
      </div>
      <button
        v-if="!collapsed"
        @click="toggleSidebar"
        class="p-1.5 rounded-md hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary"
        title="Collapse sidebar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Expand button when collapsed -->
    <button
      v-if="collapsed"
      @click="toggleSidebar"
      class="mx-auto mt-2 p-1.5 rounded-md hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary"
      title="Expand sidebar"
    >
      <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>

    <nav class="flex-1 px-2 py-4 space-y-1">
      <RouterLink
        to="/"
        class="flex items-center py-3 text-sm font-medium rounded-lg transition-colors"
        :class="[
          isActive('/') ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
          collapsed ? 'justify-center px-2' : 'px-4'
        ]"
        :title="collapsed ? 'Assets' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" :class="collapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span v-if="!collapsed" class="whitespace-nowrap">Assets</span>
      </RouterLink>

      <RouterLink
        to="/brand"
        class="flex items-center py-3 text-sm font-medium rounded-lg transition-colors"
        :class="[
          isActive('/brand') ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
          collapsed ? 'justify-center px-2' : 'px-4'
        ]"
        :title="collapsed ? 'Brand' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" :class="collapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span v-if="!collapsed" class="whitespace-nowrap">Brand</span>
      </RouterLink>

      <RouterLink
        to="/settings"
        class="flex items-center py-3 text-sm font-medium rounded-lg transition-colors"
        :class="[
          isActive('/settings') ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
          collapsed ? 'justify-center px-2' : 'px-4'
        ]"
        :title="collapsed ? 'Settings' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" :class="collapsed ? '' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span v-if="!collapsed" class="whitespace-nowrap">Settings</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const STORAGE_KEY = 'sidebar-collapsed'

const route = useRoute()
const collapsed = ref(localStorage.getItem(STORAGE_KEY) === 'true')

function isActive(path) {
  return route.path === path
}

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem(STORAGE_KEY, collapsed.value.toString())
}
</script>
