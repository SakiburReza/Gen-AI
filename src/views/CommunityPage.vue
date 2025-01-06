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
      media.value = response.data
        .map((item) => ({
          url: item.url,
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
    <div class="flex flex-col sm:flex-row sm:flex-wrap w-full">
      <!-- Left Section: Enhanced Image Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[65%] ml-15 mb-5 h-[250vh] mt-30 overflow-y-auto pr-2">
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
          :src="imageUrl() + item.url"
            :alt="'Media ' + index"
            class="h-full max-w-full rounded-lg w-full"
            :class="[item.orientation === 'P' ? 'object-full' : 'object-cover']"
          />
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
