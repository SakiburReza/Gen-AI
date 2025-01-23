<script setup lang="ts">
import CommunitySidebar from '@/components/CommunitySidebar.vue'
import ShowModalForImage from '@/components/FaceSwapToVideoModal.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { imageUrl } from '@/utils/utils'
import { FwbSpinner } from 'flowbite-vue'
import { computed, onMounted, ref } from 'vue'
import PreviewImageModal from '@/components/PreviewImageModal.vue'



const searchQuery = ref('')

const toastStore = useToastStore()
const media = ref<
  {
    url: string
    type: 'image' | 'video'
    orientation: 'P' | 'L'
    isLiked: 'Y' | 'N'
    isShared: 'Y' | 'N'
    prompt: string
  }[]
>([])
// Computed property to filter media based on the search query
const filteredMedia = computed(() => {
  // If searchQuery is null or empty, return the entire media array
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return media.value
  }
  return media.value.filter((item) => {
    const prompt = item.prompt ? item.prompt.toLowerCase() : '' // Safely handle null prompts
    return prompt.includes(searchQuery.value.toLowerCase())
  })
})

const selectedImage = ref(null) // Selected image or video

//Functions to open/close modal
const showPreviewModal = ref(false)
const closePreviewModal = () => {
  showPreviewModal.value = false
  selectedImage.value = null
}
const openPreviewModal = (mediaItem) => {
  console.log('Image clicked', media)
  console.log('mediaItem', mediaItem)

  selectedImage.value = mediaItem
  showPreviewModal.value = true
}
//States to store images from the ImageInputCard components
const referenceImage = ref<File | null>(null)
const faceImage = ref<File | null>(null)

//States
const description = ref('')


// const selectedImage = ref(null) // Selected image or video

// const showImageModal = ref(false)
// const showModal = ref(false) // Modal visibility

// const openImageModal = (mediaItem) => {
//   selectedImage.value = mediaItem

//   showModal.value = true
//   showImageModal.value = true
// }
// const closeImageModal = () => {
//   showImageModal.value = false
//   selectedImage.value = null
// }


const loading = ref(false) // Track loading state

const copyAction = async (prompt: string) => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(prompt)
      toastStore.success('Prompt copied to clipboard')
      console.log('Prompt copied to clipboard:', prompt)
    } catch (error) {
      console.error('Failed to copy prompt using Clipboard API:', error)
    }
  } else {
    console.warn('Clipboard API not supported, using fallback method')
    // Fallback method for unsupported environments
    const textArea = document.createElement('textarea')
    textArea.value = prompt
    textArea.style.position = 'fixed' // Avoid scrolling to the bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    toastStore.success('Prompt copied to clipboard')
    try {
      document.execCommand('copy')
      console.log('Prompt copied to clipboard using fallback')
    } catch (err) {
      console.error('Fallback: Unable to copy prompt:', err)
    }
    document.body.removeChild(textArea)
  }
}

// Fetch Images / Videos from API
const fetchMedia = async () => {
  loading.value = true
  try {
    const { data: response } = await genAiService.getCommunityMedia()

    if (response.status && Array.isArray(response.data)) {
      // Map data with type detection (image/video) for initial load
      media.value = response.data.map((item) => ({
        url: item.content,
        type: item.type,
        orientation: item.orientation,
        prompt: item.prompt,
        isLiked: item.like,
        isShared: item.share,
      }))
    } else {
      console.error('Failed to fetch images: Invalid response format')
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false
  }
}

const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Fetch images when the component is mounted
onMounted(async () => {
  fetchMedia()
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Search Bar -->
    <div class="flex items-center px-15 py-2 sticky top-0 z-10 w-full">
      <!-- Search Bar (Centered) -->
      <div class="flex items-center w-full md:w-[65%] pr-2 md:pr-0 md:mr-0 space-x-4">
        <div class="relative w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
          />
        </div>
      </div>

      <!-- Right-side Menu Button (Only Mobile) -->
      <button class="md:hidden p-2 ml-2" @click="toggleMenu">
        <svg class="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col md:flex-row flex-1">
      <!-- Image Grid Section -->
      <div class="flex-1 mt-1 mb-5 overflow-y-auto">
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-xs md:max-w-[60%] mx-auto ml-15 mb-5 mt-4 overflow-y-auto pr-1"
          style="max-height: calc(90vh - 4rem); overflow-y: auto"
        >
          <!-- Display spinner while loading images -->
          <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
            <fwb-spinner size="12" />
          </div>
          <div
            v-for="(item, index) in filteredMedia"
            :key="index"
            class="relative overflow-hidden rounded-lg"
            :class="[item.orientation === 'P' ? 'row-span-2' : 'row-span-1']"
          >
            <!-- Render Image -->
            <img
              v-if="filteredMedia[index] && filteredMedia[index].type === 'image'"
              :src="imageUrl() + item.url"
              :alt="'Media ' + index"
              class="h-full max-w-full rounded-lg w-full"
              :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]', 'object-cover']"
              @click="openPreviewModal(item)"
            />
            <!-- Render Video -->
            <video
              v-else-if="filteredMedia[index] && filteredMedia[index].type === 'video'"
              :src="imageUrl() + filteredMedia[index].url"
              controls
              class="w-full h-full object-contain max-w-full"
              @click="openPreviewModal(item)"
            ></video>
            <!-- Floating Buttons -->
            <div v-if="media[index]" class="absolute top-8 right-1.5 flex flex-row gap-2 items-center">
              <!-- Text Button -->
              <div class="relative group">
                <!-- Copy -->
                <button
                  @click="copyAction(media[index].prompt)"
                  class="flex justify-center items-center w-5 h-5 rounded-full shadow-md hover:shadow-lg hover:bg-gray-600 bg-gray-600 text-white border border-gray-300 transition duration-300"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1111 0H0.888889C0.4 0 0 0.395294 0 0.878431V3.51373C0 3.99686 0.4 4.39216 0.888889 4.39216C1.37778 4.39216 1.77778 3.99686 1.77778 3.51373V1.75686H7.11111V13.1765H5.33333C4.84444 13.1765 4.44444 13.5718 4.44444 14.0549C4.44444 14.538 4.84444 14.9333 5.33333 14.9333H10.6667C11.1556 14.9333 11.5556 14.538 11.5556 14.0549C11.5556 13.5718 11.1556 13.1765 10.6667 13.1765H8.88889V1.75686H14.2222V3.51373C14.2222 3.99686 14.6222 4.39216 15.1111 4.39216C15.6 4.39216 16 3.99686 16 3.51373V0.878431C16 0.395294 15.6 0 15.1111 0Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Section (Swipes In from Right on Mobile) -->
      <div
        class="md:w-64 md:ml-5 mt-5 md:mt-0 flex justify-center md:flex-none fixed top-12 right-0 w-60 h-full rounded-3xl overflow-hidden z-50 md:block transition-transform duration-300"
        :class="{ 'hidden md:block': !showMenu }"
      >
        <div class="w-80 rounded-3xl overflow-hidden">
          <CommunitySidebar class="w-full" />
        </div>
      </div>

      <!-- Overlay (Click outside to close on mobile) -->
      <div
        v-if="showMenu"
        class="fixed inset-0 z-40 md:hidden"
        @click="showMenu = false"
      ></div>


    </div>

    <!-- Modal Component -->
    <PreviewImageModal
      :isOpen="showPreviewModal"
      @close="closePreviewModal"
      :image="selectedImage"
    />
  </div>
</template>


<style scoped>
</style>
