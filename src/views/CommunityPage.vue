<script setup lang="ts">
import ShowModalForImage from '@/components/ShowModalForImage.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { ref, watch, onMounted, computed } from 'vue'
import { FwbButton, FwbCard, FwbSpinner } from 'flowbite-vue'
import { imageUrl } from '@/utils/utils'
import CommunitySidebar from '@/components/CommunitySidebar.vue'
import PreviewImageModal from '@/components/PreviewImageModal.vue'

const searchQuery = ref('')

const toastStore = useToastStore()


// Computed property to filter media based on the search query
const filteredMedia = computed(() =>
  media.value.filter((item) => item.prompt.toLowerCase().includes(searchQuery.value.toLowerCase())),
)

// Functions to open/close modal
const showPreviewModal = ref(false) 
const closePreviewModal = () => {
  showPreviewModal.value = false
  selectedImage.value = null
}
const openPreviewModal = (mediaItem) => {
  console.log("Image clicked", media);
  console.log("mediaItem", mediaItem);
  
  selectedImage.value = mediaItem
  showPreviewModal.value = true
}
const selectedImage = ref(null) // Selected image or video

// States to store images from the ImageInputCard components
// const referenceImage = ref<File | null>(null)
// const faceImage = ref<File | null>(null)

// States
// const description = ref('')
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

        type: 'image',
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

// Fetch images when the component is mounted
onMounted(async () => {
  fetchMedia()
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Search Bar and Heart Button -->
    <div class="flex items-center px-15 py-2 sticky top-0 z-10 w-full">
      <!-- Search Bar -->
      <div class="flex items-center w-full max-w-3xl border border-gray-300 rounded-md">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ml-2"
        >
          <path
            d="M23.707 22.293L16.882 15.468C18.204 13.835 19 11.76 19 9.50002C19 4.26202 14.738 0 9.49997 0C4.26197 0 0 4.26197 0 9.49997C0 14.738 4.26202 19 9.50002 19C11.76 19 13.835 18.204 15.468 16.882L22.293 23.707C22.488 23.902 22.744 24 23 24C23.256 24 23.512 23.902 23.707 23.707C24.098 23.316 24.098 22.684 23.707 22.293ZM9.50002 17C5.364 17 2.00002 13.636 2.00002 9.49997C2.00002 5.36395 5.364 1.99997 9.50002 1.99997C13.636 1.99997 17 5.36395 17 9.49997C17 13.636 13.636 17 9.50002 17Z"
            fill="#6D6D6D"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full px-4 py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <!-- Add the SVG icon inside the search bar -->
      </div>
    </div>

    <div class="flex flex-row h-full overflow-hidden">
      <div class="w-4/5 h-full mt-8 mb-5 overflow-y-auto">
        <!-- Left Section: Enhanced Image Grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[75%] ml-15 mb-5 mt-0 pr-2 overflow-y-auto"
          style="max-height: calc(90vh - 4rem); overflow-y: auto"
        >
          <!-- Display spinner while loading images -->
          <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
            <fwb-spinner size="12"/>
          </div>
          <div
            v-for="(item, index) in filteredMedia"
            :key="index"
            class="relative overflow-hidden rounded-lg"
            :class="[
              item.orientation === 'P' ? 'row-span-2' : 'row-span-1',
              'shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300',
            ]"
          >
            <!-- Render Image -->
            <img v-if="media[index] && media[index].type === 'image'"
              :src="imageUrl() + item.url"
              :alt="'Media ' + index"
              class="h-full max-w-full rounded-lg w-full"
              :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]', 'object-cover']"
              @click="openPreviewModal(item)"
            />
            <!-- Floating Buttons -->
            <div class="absolute bottom-2 right-2 flex flex-col gap-2 items-center">
              <!-- Text Button -->
              <div class="relative group">
                <!-- Share Button -->
                <button
                  @click=""
                  class="flex justify-center items-center w-8 h-8 rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="20" height="20" rx="4" fill="white" />
                    <path
                      d="M15.9716 4.16699H4.86046C4.47852 4.16699 4.16602 4.47582 4.16602 4.85327V6.91209C4.16602 7.28954 4.47852 7.59836 4.86046 7.59836C5.2424 7.59836 5.5549 7.28954 5.5549 6.91209V5.53954H9.72157V14.4611H8.33268C7.95074 14.4611 7.63824 14.7699 7.63824 15.1474C7.63824 15.5248 7.95074 15.8337 8.33268 15.8337H12.4993C12.8813 15.8337 13.1938 15.5248 13.1938 15.1474C13.1938 14.7699 12.8813 14.4611 12.4993 14.4611H11.1105V5.53954H15.2771V6.91209C15.2771 7.28954 15.5896 7.59836 15.9716 7.59836C16.3535 7.59836 16.666 7.28954 16.666 6.91209V4.85327C16.666 4.47582 16.3535 4.16699 15.9716 4.16699Z"
                      fill="#474747"
                    />
                  </svg>
                </button>

                <!-- Tooltip -->
                <div
                  @click=""
                  class="absolute mb-2 top-0 -right-18.5 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white text-blue-600 rounded-full shadow-lg px-4 py-1 text-sm font-small flex items-center gap-1 transition-all duration-300 whitespace-nowrap"
                >
                  <button @click="copyAction(media[index].prompt)"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sidebar Component -->
    <CommunitySidebar class="w-30 md:w-30" />
    <!-- Modal Component -->
    <PreviewImageModal
      :isOpen="showPreviewModal"
      @close="closePreviewModal"
      :image="selectedImage"
    />
  </div>
</template>

<style scoped>
.grid {
  scrollbar-width: thin; /* Firefox */

  scrollbar-color: #ccc #f0f0f0; /* Firefox */
}

.grid::-webkit-scrollbar {
  width: 8px; /* Width for vertical scrollbar */
}

.grid::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Scrollbar color */

  border-radius: 4px; /* Rounded scrollbar */
}

.grid::-webkit-scrollbar-track {
  background: #f0f0f0; /* Scrollbar track */
}

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
