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
          orientation: item.orientation,
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
      <!-- Left Section: Enhanced Image Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[65%] ml-15 mb-5 h-[60%] mt-6">
         <!-- Display spinner while loading images -->
         <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
            <fwb-spinner size="12" />
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
            v-if="item.type === 'image'"
            :src="item.url"
            :alt="'Media ' + index"
            class="h-full max-w-full rounded-lg w-full"
            :class="[
            item.orientation === 'P' ? 'object-full' : 'object-cover'
          ]"
          />
          <!-- Render Video -->
          <video
            v-else-if="item.type === 'video'"
            :src="item.url"
            controls
            class="h-full max-w-full rounded-lg object-cover w-full"
          ></video>
          <!-- Placeholder -->
          <div
            v-else
            class="w-full h-full flex justify-center items-center bg-gray-200 text-gray-500 font-medium rounded-lg"
          >
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
            <!-- Dropdown for Text to Image -->
            <div v-if="activeMode === 'image'">
              <select
                v-model="activeFunctionality"
                class="w-full py-2 px-3 rounded-lg bg-tertiary text-sm p-2 text-dimGray font-bold"
              >
                <option value="Text to Image" :selected="activeFunctionality === 'Text to Image'">
                  Text to Image
                </option>
                <option
                  value="Image to Image"
                  class="text-sm"
                  :selected="activeFunctionality === 'Image to Image'"
                >
                  Image to Image
                </option>
              </select>
            </div>

            <!-- Dropdown for Text to Video and Image to Video -->
            <div v-if="activeMode === 'video'">
              <select
                v-model="activeFunctionality"
                class="w-full py-2 px-3 rounded-lg bg-tertiary text-sm p-2 text-dimGray font-bold"
              >
                <option value="Text to Video" :selected="activeFunctionality === 'Text to Video'">
                  Text to Video
                </option>
                <option value="Image to Video" :selected="activeFunctionality === 'Image to Video'">
                  Image to Video
                </option>
                <option value="Face Swap" :selected="activeFunctionality === 'Face Swap'">
                  Face Swap
                </option>
                <option value="Templates" :selected="activeFunctionality === 'Templates'">
                  Templates
                </option>
              </select>
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
            Zeux IT
          </fwb-button>
        </div>

        <div
          v-if="activeFunctionality === 'Face Swap'"
          class="bg-white p-6 space-y-6 flex-shrink-0 relative"
        >
          <!-- Image Cards with Sequencial Positioning -->
          <div class="w-full space-y-6">
            <!-- First Image Card -->
            <div class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl bg-gray-200 rounded-lg shadow-lg">
              <ImageInputCard
                title="Insert Reference Face Image"
                @input="(file) => (referenceImage = file)"
              />
            </div>
            <!-- Second Image Card -->
            <div class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl bg-white rounded-lg shadow-2xl">
              <ImageInputCard title="Insert Face Image" @input="(file) => (faceImage = file)" />
            </div>
          </div>

          <CustomizationCard
            @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)"
          />
          <!-- Generate Button -->
          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full mt-8"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
        <div
          v-if="activeFunctionality === 'Text to Video'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <DescriptionCard @input="(value) => (description = value)" />
          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
        <div
          v-if="activeFunctionality === 'Image to Video'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard title="Insert Image" @input="(file) => (referenceImage = file)" />
          <DescriptionCard @input="(value) => (description = value)" />

          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
        <div
          v-if="activeFunctionality === 'Image to Image'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <CustomizationCard
            @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)"
          />
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard title="Insert Image" @input="(file) => (referenceImage = file)" />
          <DescriptionCard @input="(value) => (description = value)" />

          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
        <div
          v-if="activeFunctionality === 'Templates'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <!-- Video Carousel -->
          <VideoCarousel @video-selected="(object) => (selectedVideo = object)" />

          <ImageInputCard title="Face Image" @input="(file) => (referenceImage = file)" />
          <fwb-button
            @click="generateAiContent"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
      </div>
    </div>
    <!-- Modal Component -->
    <ShowModalForImage :isOpen="showModal" @close="closeModal" :image="selectedImage" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
/* Custom fractional row span */
.row-span-1-5 {
  grid-row: span 2 / span 1; /* Span 1.5 rows */
}
</style>
