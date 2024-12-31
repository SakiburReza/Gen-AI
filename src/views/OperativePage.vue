<script setup lang="ts">
import CustomizationCard from '@/components/CustomizationCard.vue'
import DescriptionCard from '@/components/DescriptionCard.vue'
import ImageInputCard from '@/components/ImageInputCard.vue'
import Navbar from '@/components/NavBar.vue'
import ShowModalForImage from '@/components/ShowModalForImage.vue'
import VideoCarousel from '@/components/VideoCarousel.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { ref, watch, onMounted } from 'vue'
import { FwbButton, FwbCard, FwbSpinner } from 'flowbite-vue'
import { base64ToBlobUrl } from '@/utils/utils'
import { useRoute } from 'vue-router'
import { useCredits } from '@/utils/utils'

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
const media = ref<{ url: string; type: 'image' | 'video' }[]>([]) // Array to store media
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
const fetchMedia = async (label: string) => {
  loading.value = true
  try {
    const { data: response } = await genAiService.getMedia(label)

    if (response.status && Array.isArray(response.data)) {
      // Map data with type detection (image/video) for initial load
      media.value = response.data
        .map((item) => ({
          url: base64ToBlobUrl(item.content),
          type: item.type || (item.content.includes('video') ? 'video' : 'image'),
        }))
        .slice(0, 12) // Ensure maximum of 12 items
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
  console.log(route.query.checkoutId)
  if (route.query) {
    try {
      const checkoutId = route.query.checkoutId
      const transactionId = route.query.transactionId
      console.log('checkoutId :', checkoutId, 'transactionId:', transactionId)

      if (checkoutId && transactionId) {
        const response = await genAiService.getPaymentSync(checkoutId, transactionId)
        toastStore.success(response.data)
      }

      //window.location.reload();
    } catch (error) {}
  }

  fetchMedia('text-to-image') // Initial load
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />

    <div class="flex flex-col sm:flex-row sm:flex-wrap w-full">
      <!-- Left Section: Content Grid -->
      <div class="flex-1 bg-white overflow-auto p-6 ml-15 mr-10">
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-4 h-full"
          style="grid-template-rows: repeat(3, 1fr); max-height: calc(100vh - 80px)"
        >
          <!-- Display spinner while loading contents -->
          <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
            <fwb-spinner size="12" />
          </div>

          <!-- Render media or placeholders to ensure 12 grids -->
          <div
            v-for="index in 12"
            :key="index"
            class="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white flex items-center justify-center"
            @click="
              activeFunctionality === 'Face Swap' &&
              media[index - 1] &&
              openImageModal(media[index - 1])
            "
          >
            <!-- Render Image -->
            <img
              v-if="media[index - 1] && media[index - 1].type === 'image'"
              :src="media[index - 1].url"
              :alt="'Media ' + (index - 1)"
              class="w-full h-full object-contain max-w-full"
            />
            <!-- Render Video -->
            <video
              v-else-if="media[index - 1] && media[index - 1].type === 'video'"
              :src="media[index - 1].url"
              controls
              class="w-full h-full object-contain max-w-full"
            ></video>
            <!-- Render Placeholder -->
            <div
              v-else
              class="w-full h-full flex justify-center items-center bg-gray-100 text-gray-400"
            ></div>
          </div>
        </div>
      </div>

      <!-- Floating Buttons Section -->
      <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex z-50">
        <!-- Image Button -->
        <button
          @click="setActive('image')"
          :class="[
            'flex items-center px-4 py-2 rounded-lg font-medium transition',
            activeMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
          ]"
        >
          <span class="material-icons">image</span>
        </button>
        <!-- Video Button -->
        <button
          @click="setActive('video')"
          :class="[
            'flex items-center px-4 py-2 rounded-lg font-medium transition',
            activeMode === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
          ]"
        >
          <span class="material-icons">videocam</span>
        </button>
      </div>

      <!-- Right Section: Facility Card and Dynamic Content -->
      <div class="w-full sm:w-[30%] p-6 flex-shrink-0">
        <!-- Facility Card -->
        <div class="px-6 mx-auto w-full flex justify-center">
          <div class="grid grid-cols-1 gap-2 w-full sm:w-64 md:w-80 lg:w-full">
            <!-- Text to Image-->
            <div
              v-if="activeMode === 'image'"
              :class="[
                'flex items-center cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Text to Image' ? 'border border-blue-600' : '',
              ]"
              @click="changeFunctionality('Text to Image')"
            >
              <span class="text-gray-900 text-md mx-auto">Text to Image</span>
            </div>

            <!-- Text to Video -->
            <div
              v-if="activeMode === 'video'"
              :class="[
                'flex items-center justify-center space-x-2 cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Text to Video' ? 'border border-blue-600' : '',
              ]"
              @click="changeFunctionality('Text to Video')"
            >
              <span class="text-gray-800 font-medium">Text to Video</span>
              <img src="/public/images/textToVideo.png" alt="Text to Video" class="h-6 w-6" />
            </div>

            <!-- Image to Video -->
            <div
              v-if="activeMode === 'video'"
              :class="[
                'flex items-center justify-center space-x-2 cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Image to Video' ? 'border border-blue-600' : '',
              ]"
              @click="changeFunctionality('Image to Video')"
            >
              <span class="text-gray-800 font-medium">Image to Video</span>
              <img src="/public/images/imageToVideo.png" alt="Image to Video" class="h-6 w-6" />
            </div>

            <!-- Face Swap -->
            <div
              v-if="activeMode === 'video'"
              @click="changeFunctionality('Face Swap')"
              :class="[
                'flex items-center justify-center space-x-2 cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Face Swap' ? 'border border-blue-600' : '',
              ]"
            >
              <span class="text-gray-900 font-medium">Face Swap</span>
              <img src="/public/images/icon/face-swap.svg" alt="Face Swap" class="h-6 w-6" />
            </div>

            <!-- Templates -->
            <div
              v-if="activeMode === 'video'"
              :class="[
                'flex items-center justify-center space-x-2 cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Templates' ? 'border border-blue-600' : '',
              ]"
              @click="changeFunctionality('Templates')"
            >
              <span class="text-gray-800 font-medium">Templates</span>
              <img src="/public/images/templates.png" alt="Image to Video" class="h-6 w-6" />
            </div>

            <!-- Image to Image -->
            <div
              v-if="activeMode === 'image'"
              :class="[
                'flex items-center cursor-pointer hover:bg-tertiary rounded-lg py-1.5 bg-tertiary',
                activeFunctionality === 'Image to Image' ? 'border border-blue-600' : '',
              ]"
              @click="changeFunctionality('Image to Image')"
            >
              <span class="text-gray-800 text-md mx-auto">Image to Image</span>
            </div>
          </div>
        </div>
        <!-- Dynamic Content Based on Selected Functionality -->
        <div
          v-if="activeFunctionality === 'Text to Image'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <CustomizationCard
            @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)"
          />
          <DescriptionCard @input="(value) => (description = value)" />
          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
        <!-- Other functionalities are omitted for brevity -->
      </div>
    </div>

    <!-- Modal Component -->
    <ShowModalForImage :isOpen="showModal" @close="closeModal" :image="selectedImage" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
