<template>
  <div class="flex h-full overflow-hidden bg-zinc-900">
    <!-- Platform Tabs Sidebar -->
    <div class="w-16 border-r border-zinc-700 flex flex-col items-center py-4 gap-2">
      <button
        v-for="platform in platforms"
        :key="platform.id"
        @click="activePlatform = platform.id"
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
          activePlatform === platform.id
            ? 'bg-gradient-to-br shadow-lg ' + platform.activeClass
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
        ]"
        :title="platform.name"
      >
        <component :is="platform.icon" class="w-6 h-6" />
      </button>
    </div>

    <!-- Main Preview Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-zinc-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <component
            :is="currentPlatform.icon"
            :class="['w-6 h-6', currentPlatform.textColor]"
          />
          <h2 class="text-lg font-semibold text-zinc-100">{{ currentPlatform.name }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <!-- Character Count -->
          <div
            v-if="currentContent"
            :class="[
              'text-sm font-mono px-3 py-1 rounded-full',
              charCountStatus.class
            ]"
          >
            {{ charCountStatus.current }} / {{ charCountStatus.limit }}
          </div>
          <!-- Copy Button -->
          <button
            @click="copyContent"
            class="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      <!-- Platform Preview -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <div class="text-zinc-400">Loading content...</div>
        </div>

        <div v-else-if="error" class="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400">
          {{ error }}
        </div>

        <div v-else-if="!currentContent" class="flex items-center justify-center h-full text-zinc-500">
          No {{ currentPlatform.name }} content found in this post
        </div>

        <!-- Twitter/X Preview -->
        <div v-else-if="activePlatform === 'twitter'" class="max-w-xl mx-auto">
          <div class="bg-black rounded-2xl border border-zinc-800 overflow-hidden">
            <!-- Tweet Header -->
            <div class="p-4 flex items-start gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {{ getInitials(asset.name) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white">Your Brand</span>
                  <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                  </svg>
                  <span class="text-zinc-500">@yourbrand · now</span>
                </div>
                <!-- Tweet Content -->
                <div class="mt-2 text-white whitespace-pre-wrap text-[15px] leading-relaxed">
                  {{ formatTwitterContent(currentContent) }}
                </div>
                <!-- Tweet Actions -->
                <div class="mt-4 flex items-center justify-between text-zinc-500 max-w-md">
                  <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span class="text-sm">Reply</span>
                  </button>
                  <button class="flex items-center gap-2 hover:text-green-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span class="text-sm">Repost</span>
                  </button>
                  <button class="flex items-center gap-2 hover:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span class="text-sm">Like</span>
                  </button>
                  <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LinkedIn Preview -->
        <div v-else-if="activePlatform === 'linkedin'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <!-- Post Header -->
            <div class="p-4 flex items-start gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                {{ getInitials(asset.name) }}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">Your Brand</div>
                <div class="text-sm text-gray-500">Marketing Agency · 1,234 followers</div>
                <div class="text-xs text-gray-400 flex items-center gap-1">
                  <span>Just now</span>
                  <span>·</span>
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>
            </div>
            <!-- Post Content -->
            <div class="px-4 pb-3 text-gray-800 whitespace-pre-wrap text-[14px] leading-relaxed">
              {{ formatLinkedInContent(currentContent) }}
            </div>
            <!-- Engagement Bar -->
            <div class="px-4 py-2 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
              <div class="flex -space-x-1">
                <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                </div>
                <div class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
              </div>
              <span>128 reactions</span>
              <span class="ml-auto">24 comments · 8 reposts</span>
            </div>
            <!-- Action Buttons -->
            <div class="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
              <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                <span class="font-medium">Like</span>
              </button>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span class="font-medium">Comment</span>
              </button>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span class="font-medium">Repost</span>
              </button>
              <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                <span class="font-medium">Send</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Instagram Preview -->
        <div v-else-if="activePlatform === 'instagram'" class="max-w-md mx-auto">
          <div class="bg-black rounded-lg border border-zinc-800 overflow-hidden">
            <!-- Post Header -->
            <div class="p-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div class="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                  {{ getInitials(asset.name) }}
                </div>
              </div>
              <span class="font-semibold text-white text-sm">yourbrand</span>
              <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z"/>
              </svg>
              <button class="ml-auto text-white">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
              </button>
            </div>
            <!-- Image Placeholder -->
            <div class="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <svg class="w-16 h-16 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- Actions -->
            <div class="p-3 flex items-center gap-4">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              <svg class="w-7 h-7 text-white ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
            <!-- Likes -->
            <div class="px-3 pb-1">
              <span class="font-semibold text-white text-sm">1,234 likes</span>
            </div>
            <!-- Caption -->
            <div class="px-3 pb-3 text-white text-sm">
              <span class="font-semibold">yourbrand</span>
              <span class="ml-1 whitespace-pre-wrap">{{ formatInstagramContent(currentContent) }}</span>
            </div>
            <!-- Timestamp -->
            <div class="px-3 pb-3 text-zinc-500 text-xs uppercase">
              Just now
            </div>
          </div>
        </div>

        <!-- TikTok Preview -->
        <div v-else-if="activePlatform === 'tiktok'" class="max-w-sm mx-auto">
          <div class="bg-black rounded-2xl overflow-hidden aspect-[9/16] relative">
            <!-- Video Background -->
            <div class="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-800 to-black"></div>
            <!-- Content Overlay -->
            <div class="absolute inset-0 flex flex-col justify-end p-4">
              <!-- Script Content -->
              <div class="mb-16 text-white text-sm leading-relaxed">
                <div class="font-semibold mb-2">@yourbrand</div>
                <div class="whitespace-pre-wrap">{{ formatTikTokContent(currentContent) }}</div>
              </div>
            </div>
            <!-- Right Actions -->
            <div class="absolute right-3 bottom-20 flex flex-col items-center gap-5">
              <div class="flex flex-col items-center gap-1">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <span class="text-white text-xs">12.3K</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <span class="text-white text-xs">892</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                </div>
                <span class="text-white text-xs">234</span>
              </div>
            </div>
          </div>
        </div>

        <!-- YouTube Community Preview -->
        <div v-else-if="activePlatform === 'youtube'" class="max-w-xl mx-auto">
          <div class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <!-- Header -->
            <div class="p-4 flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                {{ getInitials(asset.name) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-white">Your Channel</span>
                  <svg class="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div class="text-sm text-zinc-500">Just now</div>
              </div>
            </div>
            <!-- Content -->
            <div class="px-4 pb-4 text-white whitespace-pre-wrap">
              {{ currentContent }}
            </div>
            <!-- Actions -->
            <div class="px-4 pb-4 flex items-center gap-4 text-zinc-400">
              <button class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                <span>Like</span>
              </button>
              <button class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"/></svg>
              </button>
              <button class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Raw Content Sidebar -->
    <div class="w-80 border-l border-zinc-700 overflow-y-auto p-4 hidden xl:block">
      <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Raw Content</h3>
      <pre class="text-xs text-zinc-400 whitespace-pre-wrap font-mono bg-zinc-800/50 p-3 rounded-lg">{{ currentContent }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const rawContent = ref('')
const parsedSections = ref({})
const activePlatform = ref('twitter')

// Platform definitions
const platforms = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    charLimit: 280,
    activeClass: 'from-zinc-700 to-zinc-900 text-white',
    textColor: 'text-white',
    icon: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })
    ])
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    charLimit: 3000,
    activeClass: 'from-blue-600 to-blue-800 text-white',
    textColor: 'text-blue-400',
    icon: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' })
    ])
  },
  {
    id: 'instagram',
    name: 'Instagram',
    charLimit: 2200,
    activeClass: 'from-purple-500 via-pink-500 to-orange-400 text-white',
    textColor: 'text-pink-400',
    icon: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' })
    ])
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    charLimit: 2200,
    activeClass: 'from-cyan-400 via-pink-500 to-black text-white',
    textColor: 'text-cyan-400',
    icon: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' })
    ])
  },
  {
    id: 'youtube',
    name: 'YouTube',
    charLimit: 500,
    activeClass: 'from-red-500 to-red-700 text-white',
    textColor: 'text-red-400',
    icon: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })
    ])
  }
]

const currentPlatform = computed(() => {
  return platforms.find(p => p.id === activePlatform.value) || platforms[0]
})

const currentContent = computed(() => {
  return parsedSections.value[activePlatform.value] || ''
})

const charCountStatus = computed(() => {
  const content = currentContent.value
  const limit = currentPlatform.value.charLimit
  const current = content.length

  let statusClass = 'bg-green-500/20 text-green-400'
  if (current > limit) {
    statusClass = 'bg-red-500/20 text-red-400'
  } else if (current > limit * 0.9) {
    statusClass = 'bg-yellow-500/20 text-yellow-400'
  }

  return { current, limit, class: statusClass }
})

// Parse markdown sections by platform
const parseContent = (content) => {
  const sections = {}

  // Match ## Platform Name sections
  const platformPatterns = [
    { id: 'twitter', patterns: ['## Twitter/X', '## Twitter', '## X'] },
    { id: 'linkedin', patterns: ['## LinkedIn'] },
    { id: 'instagram', patterns: ['## Instagram'] },
    { id: 'tiktok', patterns: ['## TikTok Script', '## TikTok'] },
    { id: 'youtube', patterns: ['## YouTube Community', '## YouTube'] }
  ]

  for (const platform of platformPatterns) {
    for (const pattern of platform.patterns) {
      const regex = new RegExp(`${pattern}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i')
      const match = content.match(regex)
      if (match) {
        sections[platform.id] = match[1].trim()
        break
      }
    }
  }

  return sections
}

// Format functions for each platform
const formatTwitterContent = (content) => {
  // Remove ### Thread header and clean up thread markers
  return content
    .replace(/^### Thread\s*\n?/i, '')
    .replace(/^---\s*$/gm, '')
    .trim()
}

const formatLinkedInContent = (content) => {
  return content
    .replace(/^---\s*$/gm, '')
    .trim()
}

const formatInstagramContent = (content) => {
  // Remove the ... separator
  return content
    .replace(/^\.\s*$/gm, '')
    .replace(/^---\s*$/gm, '')
    .trim()
}

const formatTikTokContent = (content) => {
  // Clean up script markers
  return content
    .replace(/^\*\*\[HOOK.*?\]\*\*\s*/gm, '🎬 HOOK: ')
    .replace(/^\*\*\[BODY\]\*\*\s*/gm, '\n📝 BODY:\n')
    .replace(/^\*\*\[CTA\]\*\*\s*/gm, '\n👆 CTA:\n')
    .replace(/^\*Show.*?\*$/gm, '')
    .replace(/^---\s*$/gm, '')
    .trim()
}

const getInitials = (name) => {
  return name?.slice(0, 2).toUpperCase() || 'YB'
}

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(currentContent.value)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const fetchContent = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`/api/assets/${props.asset.id}/content`)
    if (!response.ok) throw new Error('Failed to load content')

    const data = await response.json()
    rawContent.value = data.content
    parsedSections.value = parseContent(data.content)

    // Set first available platform as active
    const available = Object.keys(parsedSections.value)
    if (available.length > 0 && !available.includes(activePlatform.value)) {
      activePlatform.value = available[0]
    }
  } catch (err) {
    error.value = err.message
    console.error('Failed to fetch content:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchContent()
})
</script>
