<script setup lang="ts">
import ShowModalForImage from '@/components/ShowModalForImage.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { ref, watch, onMounted } from 'vue'
import { FwbButton, FwbCard, FwbSpinner } from 'flowbite-vue'
import { base64ToBlobUrl } from '@/utils/utils'
import { useRoute } from 'vue-router'
import { useCredits } from '@/utils/utils'
import { imageUrl } from '@/utils/utils'
import CommunitySidebar from '@/components/CommunitySidebar.vue'

const { fetchCredits } = useCredits()

const route = useRoute()

// const router = useRouter();
// const creditsFromQuery = router.currentRoute.value.query.credits || 10;

// console.log("lll",creditsFromQuery)

const toastStore = useToastStore()

const selectedVideo = ref(null)

const selectedImage = ref(null) // Selected image or video
const showModal = ref(false) // Modal visibility

// Functions to open/close modal
const openImageModal = (mediaItem) => {
  selectedImage.value = mediaItem
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedImage.value = null
}

// States to store images from the ImageInputCard components
const referenceImage = ref<File | null>(null)
const faceImage = ref<File | null>(null)

// States
const description = ref('')
const media = ref<{ url: string; type: 'image' | 'video'; orientation: 'L' | 'P' }[]>([]) // Array to store media
const loading = ref(false) // Track loading state

const activeMode = ref('image')

function setActive(button) {
  activeMode.value = button
}

// Active functionality state
const activeFunctionality = ref<
  | 'Text to Image'
  | 'Face Swap'
  | 'Text to Video'
  | 'Image to Video'
  | 'Image to Image'
  | 'Templates'
>('Text to Image')

function changeFunctionality(mode) {
  console.log(mode)
  activeFunctionality.value = mode
}

// Watcher to trigger fetchImages based on activeFunctionality changes
watch(activeFunctionality, async (newValue) => {
  if (newValue === 'Face Swap') {
    await fetchMedia('face-swap')
  } else if (newValue === 'Text to Image') {
    await fetchMedia('text-to-image')
  } else if (newValue === 'Image to Image') {
    await fetchMedia('image-to-image')
  } else if (newValue === 'Image to Video') {
    await fetchMedia('image-to-video')
  } else if (newValue === 'Text to Video') {
    await fetchMedia('text-to-video')
  } else if (newValue === 'Templates') {
    await fetchMedia('template-video')
  }
})

watch(activeMode, async (newValue) => {
  if (newValue === 'video') {
    activeFunctionality.value = 'Text to Video'
    await fetchMedia('text-to-video')
  } else if (newValue === 'image') {
    activeFunctionality.value = 'Text to Image'
    await fetchMedia('text-to-image')
  }
})

const selectedRatio = ref('Landscape')
const selectedOutput = ref(1)

// Fetch Images / Videos from API
const fetchMedia = async () => {
  loading.value = true
  try {
    const { data: response } = await genAiService.getCommunityMedia()

    if (response.status && Array.isArray(response.data)) {
      // Map data with type detection (image/video) for initial load
      media.value = response.data.map((item) => ({
        url: item.content,
        orientation: item.orientation,
      }))
      // .slice(0, 12) // Ensure maximum of 12 items
    } else {
      console.error('Failed to fetch images: Invalid response format')
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false
  }
}

const generateAiContent = async () => {
  loading.value = true
  try {
    let response

    // Handling different types of functionalities
    if (activeFunctionality.value === 'Face Swap') {
      const formData = new FormData()
      formData.append('targetImage', referenceImage.value!)
      formData.append('swapImage', faceImage.value!)
      response = await genAiService.faceSwap(formData)
    } else if (activeFunctionality.value === 'Text to Image') {
      response = await genAiService.textToImage({
        text: description.value,
        image_size: selectedRatio.value,
        num_images: selectedOutput.value,
      })
    } else if (activeFunctionality.value === 'Text to Video') {
      response = await genAiService.textToVideo({ text: description.value })
    } else if (activeFunctionality.value === 'Image to Video') {
      const formData = new FormData()
      let type = 'face-swap'
      formData.append('image', referenceImage.value!)
      formData.append('prompt', description.value)
      formData.append('type', type)
      response = await genAiService.imageToVideo(formData)
    } else if (activeFunctionality.value === 'Image to Image') {
      const formData = new FormData()
      formData.append('image', referenceImage.value!)
      formData.append('text', description.value)
      formData.append('image_size', selectedRatio.value)
      formData.append('num_images', selectedOutput.value.toString())
      response = await genAiService.imageToImage(formData)
    } else if (activeFunctionality.value === 'Templates') {
      // Create form data for file and video index
      const formData = new FormData()
      formData.append('template_id', selectedVideo.value.id) // Assuming videoIndex is expected by server
      formData.append('image', referenceImage.value) // Assuming faceImage is expected by server
      formData.append('prompt', selectedVideo.value.prompt)
      // Make the API call
      response = await genAiService.templateVideo(formData)

      // Handle response
      console.log('Server Response:', response.data)
    }

    if (response?.data?.status) {
      toastStore.success(response?.data.message)
      await fetchCredits()
      const contents = response.data.data.content
      // Check if 'contents' is an array and iterate over each content
      if (Array.isArray(contents)) {
        contents.forEach((base64Content) => {
          // Determine the media type based on base64 content
          const mediaType = base64Content.startsWith('data:video/mp4;') ? 'video' : 'image'
          const newMedia = {
            url: base64ToBlobUrl(base64Content, mediaType), // Convert base64 to Blob URL
            type: mediaType,
          }

          // Prepend the new media and maintain the list size at 12
          media.value = [newMedia, ...media.value].slice(0, 12)
        })
      } else {
        // Handle the case where the content is a single item (fallback for non-array responses)
        const mediaType = contents.startsWith('data:video/mp4;') ? 'video' : 'image'
        const newMedia = {
          url: base64ToBlobUrl(contents, mediaType),
          type: mediaType,
        }
        media.value = [newMedia, ...media.value].slice(0, 12)
      }
      // Update credits after successful content generation
      await fetchCredits()
    } else {
      console.error('Failed to generate media:', response)
    }
  } catch (error) {
    console.error('Error generating media:', error)
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
    <div class="flex items-center px-15 py-2 sticky top-0 z-10">
      <!-- Search Bar -->
      <div class="flex items-center w-full max-w-3xl border border-gray-300 rounded-md">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ml-2">
          <path d="M23.707 22.293L16.882 15.468C18.204 13.835 19 11.76 19 9.50002C19 4.26202 14.738 0 9.49997 0C4.26197 0 0 4.26197 0 9.49997C0 14.738 4.26202 19 9.50002 19C11.76 19 13.835 18.204 15.468 16.882L22.293 23.707C22.488 23.902 22.744 24 23 24C23.256 24 23.512 23.902 23.707 23.707C24.098 23.316 24.098 22.684 23.707 22.293ZM9.50002 17C5.364 17 2.00002 13.636 2.00002 9.49997C2.00002 5.36395 5.364 1.99997 9.50002 1.99997C13.636 1.99997 17 5.36395 17 9.49997C17 13.636 13.636 17 9.50002 17Z" fill="#6D6D6D"/>
        </svg>
        <input
          type="text"
          placeholder="Search"
          class="w-full px-4 py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <!-- Add the SVG icon inside the search bar -->
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="ml-2 mr-2">
          <path d="M19.2016 9.14227H4.80156C4.08156 9.14227 3.60156 8.6851 3.60156 7.99936C3.60156 7.31361 4.08156 6.85645 4.80156 6.85645H19.2016C19.9216 6.85645 20.4016 7.31361 20.4016 7.99936C20.4016 8.6851 19.9216 9.14227 19.2016 9.14227Z" fill="#474747"/>
          <path d="M15.5992 16.0007H8.39922C7.67922 16.0007 7.19922 15.5435 7.19922 14.8578C7.19922 14.172 7.67922 13.7148 8.39922 13.7148H15.5992C16.3192 13.7148 16.7992 14.172 16.7992 14.8578C16.7992 15.5435 16.3192 16.0007 15.5992 16.0007Z" fill="#474747"/>
          <path d="M22.8 2.28582H1.2C0.48 2.28582 0 1.82866 0 1.14291C0 0.457164 0.48 0 1.2 0H22.8C23.52 0 24 0.457164 24 1.14291C24 1.82866 23.52 2.28582 22.8 2.28582Z" fill="#474747"/>
        </svg>
      </div>
      <!-- Heart Button -->
      <button
        @click=""
        class="ml-4 flex justify-center items-center w-12 h-12 bg-gray-300 text-white border border-gray-300 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.485 8.485a.75.75 0 001.06 0l8.485-8.485a5.5 5.5 0 000-7.78z"
          />
        </svg>
      </button>
    </div>

    <div class="flex flex-row h-full overflow-hidden">
      <div class="w-full overflow-y-auto h-full mt-8 mb-5">
      <!-- Left Section: Enhanced Image Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-1 md:w-[65%] ml-15 mb-5 mt-0 overflow-y-auto pr-2]">
<!--        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:w-full">-->
        <!-- Display spinner while loading images -->
        <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
          <fwb-spinner />
        </div>
        <div
          v-for="(item, index) in media"
          :key="index"
          class="relative overflow-hidden rounded-lg"
          :class="[
            item.orientation === 'P' ? 'row-span-2' : 'row-span-1',
            'shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300',
          ]"
        >
          <!-- Render Image -->
          <img
            :src="imageUrl() + item.url"
            :alt="'Media ' + index"
            class="h-full max-w-full rounded-lg w-full"
            :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]', 'object-cover']"
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"

                >
                  <rect width="20" height="20" rx="4" fill="blue" />
                  <path
                    d="M15.9716 4.16699H4.86046C4.47852 4.16699 4.16602 4.47582 4.16602 4.85327V6.91209C4.16602 7.28954 4.47852 7.59836 4.86046 7.59836C5.2424 7.59836 5.5549 7.28954 5.5549 6.91209V5.53954H9.72157V14.4611H8.33268C7.95074 14.4611 7.63824 14.7699 7.63824 15.1474C7.63824 15.5248 7.95074 15.8337 8.33268 15.8337H12.4993C12.8813 15.8337 13.1938 15.5248 13.1938 15.1474C13.1938 14.7699 12.8813 14.4611 12.4993 14.4611H11.1105V5.53954H15.2771V6.91209C15.2771 7.28954 15.5896 7.59836 15.9716 7.59836C16.3535 7.59836 16.666 7.28954 16.666 6.91209V4.85327C16.666 4.47582 16.3535 4.16699 15.9716 4.16699Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <button>Copy prompt</button>
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
    <ShowModalForImage :isOpen="showModal" @close="closeModal" :image="selectedImage" />
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
