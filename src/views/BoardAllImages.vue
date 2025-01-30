<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { imageUrl } from '@/utils/utils'
import { onMounted, ref } from 'vue'
import genAiService from '@/services/gen-ai'
import { useRoute } from 'vue-router'
import PreviewImageModal from '@/components/PreviewImageModal.vue'

const images = ref([])
const searchQuery = ref('')
const route = useRoute()
const board = route.query.board

const media = ref<
  {
    url: string
    type: 'image' | 'video'
    orientation: 'P' | 'L'
    isLiked: 'Y' | 'N'
    isShared: 'Y' | 'N'
    prompt: string
    owner: string
  }[]
>([])

onMounted(() => {
  boardImagesByName()
  collaborateBoardImagesByName()
})

const boardImagesByName = async () => {
  try {
    const response = await genAiService.getBoardImagesByName(board)
    if (response.status && Array.isArray(response.data.data[0].images)) {
      // Map data with type detection (image/video) for initial load
      media.value = response.data.data[0].images.map((item) => ({
        url: item.content,
        type: item.type || 'image',
        orientation: item.orientation,
        prompt: item.prompt,
        isLiked: item.like,
        isShared: item.share,
        owner: item.shareOwner,
      }))
    } else {
      console.error('Failed to fetch images: Invalid response format')
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  }
}

const collaborateBoardImagesByName = async () => {
  try {
    const response = await genAiService.getCollaborateBoardsInfo(board)
    if (response.data.data?.length) {
      images.value = response.data.data[0].images || []
    }
  } catch (error) {
    console.error('Error fetching board images:', error)
  }
}
//Functions to open/close modal
const showPreviewModal = ref(false)
const selectedImage = ref(null)
const closePreviewModal = () => {
  showPreviewModal.value = false
  selectedImage.value = null
}
const openPreviewModal = (mediaItem) => {
  console.log('mediaItem', mediaItem)
  selectedImage.value = mediaItem
  showPreviewModal.value = true
}
</script>

<template>
  <DefaultLayout>
    <!-- search input -->
    <div class="relative group w-full mt-2 p-2">
      <img
        src="/src/assets/icon/SearchIcon.svg"
        alt="Search"
        class="h-5 w-5 absolute top-1/2 ml-3 transform -translate-y-1/2 text-gray-500"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-0 focus:border-gray-300"
      />
    </div>
    <!-- user information -->
    <div class="flex items-center justify-center p-6">
      <div class="w-full max-w-lg">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ board }}</h2>
          <div class="flex items-center gap-3">
            <img src="/src/assets/icon/shareThreeDot.svg" alt="" />
          </div>
        </div>
        <p class="text-gray-500 text-sm">{{ board.length }} Photos</p>
        <div class="flex items-center gap-3 mt-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            class="w-10 h-10 border-2 border-gray-300"
          />
        </div>
        <div class="flex mt-2">
          <button class="flex flex-col items-center">
            <img src="/src/assets/icon/organize.svg" alt="" />
            <span class="text-sm text-gray-700">Organize</span>
          </button>
          <button class="flex flex-col items-center w-24">
            <img src="/src/assets/icon/moreIdeas.svg" alt="" />
            <span class="text-sm text-gray-700">More Ideas</span>
          </button>
        </div>
      </div>
    </div>

    <!-- filter and create board -->
    <div class="flex justify-between p-2">
      <div></div>
      <div><img class="h-12 w-12" src="/src/assets/icon/filterIconWhite.svg" alt="" /></div>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 rounded-t-2xl mb-10 overflow-y-auto p-2"
    >
      <div
        v-for="(item, index) in media"
        :key="index"
        class="relative overflow-hidden group"
        :class="[item.orientation === 'P' ? 'row-span-2' : 'row-span-1']"
      >
        <!-- Render Image -->
        <img
          :src="imageUrl() + item.url"
          :alt="'Media ' + index"
          class="h-full max-w-full w-full object-cover"
          :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]']"
          @click="openPreviewModal(item)"
        />
      </div>
    </div>
    <!-- Modal Component -->
    <PreviewImageModal
      :isOpen="showPreviewModal"
      @close="closePreviewModal"
      :image="selectedImage"
    />
  </DefaultLayout>
</template>
