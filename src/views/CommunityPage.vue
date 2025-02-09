<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { useToastStore } from '@/stores/toast'
import { computed, ref, onMounted } from 'vue'

import ForYouPage from '@/components/ForYouPage.vue'
import { useRoute } from 'vue-router'
import { Divide } from 'lucide-vue-next'
import FavouritePage from '@/components/FavouritePage.vue'
import FollowingPage from '@/components/FollowingPage.vue'
const searchQuery = ref('')
const authTokenInfo = ref('')
const isSaveBoardOpen = ref(false)
const imageUrlData = ref('')
const toastStore = useToastStore()
const route = useRoute()
const showBadge = computed(() => route.path !== '/')
const selectedImage = ref(null)
const showPreviewModal = ref(false)
const loading = ref(false)
const showMenu = ref(false)
const media = ref<
  {
    url: string
    type: 'image' | 'video'
    orientation: 'P' | 'L'
    isLiked: 'Y' | 'N'
    isShared: 'Y' | 'N'
    prompt: string
    owner: string
    board: string
  }[]
>([])
const activeTab = ref('for-you')
</script>
<template>
  <DefaultLayout :showBadge="showBadge">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-10 py-2 sticky top-0 z-10 w-full">
        <div class="flex items-center space-x-10 text-sm sm:text-base md:text-lg">
          <span v-for="tab in ['for-you', 'following', 'favourites']" :key="tab" @click="activeTab = tab"
            class="cursor-pointer font-semibold font-inter text-greysilver text-sm sm:text-base md:text-lg pb-2" :class="{
              'text-raisinblack border-b-2 border-raisinblack': activeTab === tab,
              'text-gray-400 hover:text-raisinblack': activeTab !== tab
            }">
            {{ tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
          </span>
        </div>

        <!-- Search Bar (Right Aligned) -->
        <div class="relative group w-full max-w-xs md:max-w-sm">
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-0 focus:border-gray-300" />
        </div>
      </div>

      <!-- Content Section   (For You)-->
      <div v-if="activeTab === 'for-you'"
        class="flex-1 mt-1 mb-5 overflow-y-auto p-4 sm:mt-2 sm:mb-6 sm:p-5 md:mt-3 md:mb-7 md:p-6 lg:mt-4 lg:mb-8 lg:p-7 xl:mt-5 xl:mb-9 xl:p-8">
        <ForYouPage />
      </div>
      <div v-if="activeTab === 'favourites'"
        class="flex-1 mt-1 mb-5 overflow-y-auto p-4 sm:mt-2 sm:mb-6 sm:p-5 md:mt-3 md:mb-7 md:p-6 lg:mt-4 lg:mb-8 lg:p-7 xl:mt-5 xl:mb-9 xl:p-8">
        <FavouritePage />
      </div>
      <div v-if="activeTab === 'following'"
        class="flex-1 mt-1 mb-5 overflow-y-auto p-4 sm:mt-2 sm:mb-6 sm:p-5 md:mt-3 md:mb-7 md:p-6 lg:mt-4 lg:mb-8 lg:p-7 xl:mt-5 xl:mb-9 xl:p-8">
        <FollowingPage />
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped></style>
