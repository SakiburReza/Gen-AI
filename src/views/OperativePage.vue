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
import { imageUrl } from '@/utils/utils'
import PreviewImageModal from '@/components/PreviewImageModal.vue'

const { fetchCredits } = useCredits()

const route = useRoute()

// const router = useRouter();

// const creditsFromQuery = router.currentRoute.value.query.credits || 10;

// console.log("lll",creditsFromQuery)

const toastStore = useToastStore()

const selectedVideo = ref(null)

const selectedImage = ref(null) // Selected image or video
const showImageModal = ref(false)

const showModal = ref(false) // Modal visibility
const showPreviewModal = ref(false) // Controls PreviewImageModal

// Functions to open/close modal

const openImageModal = (mediaItem) => {
  selectedImage.value = mediaItem

  showModal.value = true
  showImageModal.value = true
}
const openPreviewModal = (mediaItem) => {
  selectedImage.value = mediaItem
  showPreviewModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = null
}
const closePreviewModal = () => {
  showPreviewModal.value = false
  selectedImage.value = null
}

// States to store images from the ImageInputCard components

const referenceImage = ref<File | null>(null)

const faceImage = ref<File | null>(null)

// States

const description = ref('')

const media = ref<{ url: string; type: 'image' | 'video'; orientation: 'P' | 'L' }[]>([]) // Array to store media

const loading = ref(false) // Track loading state

const activeMode = ref('image')

function setActive(button) {
  if (button === 'video') {
    selectVideoOption(videoModeOptions[0])
  } else {
    selectImageOption(imageModeOptions[0])
  }

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
          url: item.content,

          type:
            item.type ||
            (label === 'text-to-video' ||
            label === 'image-to-video' ||
            label === 'template-video' ||
            (label === 'face-swap' && item.orientation == null)
              ? 'video'
              : 'image'),
          orientation: item.orientation,
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

      formData.append('image', referenceImage.value!)

      formData.append('prompt', description.value)

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

          media.value = [newMedia, ...media.value]
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

//Dropdown property

// const activeModeDropDown = ref('image')

const isImageDropdownOpen = ref(false)

const selectedLabel = ref(null)

const selectedImageDropDown = ref(null)

function selectImageOption(option) {
  selectedLabel.value = option.text // Update the selected label

  selectedImageDropDown.value = option.imageSrc // Update the selected image

  activeFunctionality.value = option.text

  isImageDropdownOpen.value = false // Close the dropdown
}

function selectVideoOption(option) {
  selectedLabel.value = option.text // Update the selected label

  selectedImageDropDown.value = option.imageSrc // Update the selected image

  activeFunctionality.value = option.text

  isImageDropdownOpen.value = false // Close the dropdown
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

  selectImageOption(imageModeOptions[0])

  fetchMedia('text-to-image') // Initial load
})
const videoModeOptions = [
  {
    id: '21',

    imageSrc: '/public/images/icon/text-to-video.svg',

    text: 'Text to Video',
  },

  {
    id: '22',

    imageSrc: '/public/images/icon/image-to-video.svg',

    text: 'Image to Video',
  },

  {
    id: '23',

    imageSrc: '/public/images/icon/face-swap.svg',

    text: 'Face Swap',
  },

  {
    id: '24',

    imageSrc: '/public/images/icon/templates.svg',

    text: 'Templates',
  },
]

const imageModeOptions = [
  {
    id: '11',

    imageSrc: '/public/images/icon/image-to-image.svg',

    text: 'Image to Image',
  },

  {
    id: '12',

    imageSrc: '/public/images/icon/text-to-image.svg',

    text: 'Text to Image',
  },
]
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />

    <div class="flex flex-col sm:flex-row sm:flex-wrap w-full">
      <!-- Left Section: Enhanced Image Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[65%] ml-15 mb-5 mt-6 overflow-y-auto pr-2">
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
          @click="
            activeFunctionality === 'Face Swap' &&
            media[index] &&
            openImageModal(media[index])
          "
        >
          <!-- Render Image -->

          <img
            v-if="media[index] && media[index].type === 'image'"
            :src="imageUrl() + item.url"
            :alt="'Media ' + index"
            class="h-full max-w-full rounded-lg w-full"
            :class="[item.orientation === 'P' ? 'object-full' : 'object-cover']"
            @click="
              (activeFunctionality === 'Image to Image' ||
                activeFunctionality === 'Text to Image') &&
              media[index] &&
              openPreviewModal(media[index])
            "
          />

          <!-- Render Video -->

          <video
            v-else-if="media[index] && media[index].type === 'video'"
            :src="imageUrl() + media[index].url"
            controls
            class="w-full h-full object-contain max-w-full"
            @click="
              (activeFunctionality === 'Text to Video' ||
                activeFunctionality === 'Image to Video' ||
                activeFunctionality === 'Templates') &&
              media[index] &&
              openPreviewModal(media[index])
            "
          ></video>

          <!------------------------------------------------------ Roney ----------------------------------------->
          <!-- Floating Buttons -->
          <div v-if="media[index] && media[index].type === 'image'" class="absolute bottom-2 right-2 flex flex-col gap-2 items-center">

            <!-- Share Button with Group Class -->
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
                    d="M13.3438 11.7812C12.6336 11.7812 12.0078 12.123 11.6147 12.6427L8.21643 10.9404C8.27285 10.7523 8.3125 10.5573 8.3125 10.3516C8.3125 10.0725 8.25402 9.80723 8.15299 9.56322L11.7095 7.46959C12.1053 7.924 12.687 8.21875 13.3438 8.21875C14.5328 8.21875 15.5 7.27255 15.5 6.10938C15.5 4.9462 14.5328 4 13.3438 4C12.1547 4 11.1875 4.9462 11.1875 6.10938C11.1875 6.37743 11.2439 6.6317 11.3375 6.86777L7.77044 8.96753C7.37499 8.52663 6.80162 8.24219 6.15625 8.24219C4.96722 8.24219 4 9.18838 4 10.3516C4 11.5147 4.96722 12.4609 6.15625 12.4609C6.87811 12.4609 7.51447 12.1092 7.90605 11.5749L11.2932 13.2716C11.2308 13.4686 11.1875 13.6738 11.1875 13.8906C11.1875 15.0538 12.1547 16 13.3438 16C14.5328 16 15.5 15.0538 15.5 13.8906C15.5 12.7274 14.5328 11.7812 13.3438 11.7812Z"
                    fill="#474747"
                  />
                </svg>
              </button>

              <!-- Tooltip -->
              <div
                @click=""
                class="absolute mb-2 top-0 -right-20 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white text-blue-600 rounded-full shadow-lg px-4 py-1 text-sm font-small flex items-center gap-1 transition-all duration-300 whitespace-nowrap"
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
                    d="M13.3438 11.7812C12.6336 11.7812 12.0078 12.123 11.6147 12.6427L8.21643 10.9404C8.27285 10.7523 8.3125 10.5573 8.3125 10.3516C8.3125 10.0725 8.25402 9.80723 8.15299 9.56322L11.7095 7.46959C12.1053 7.924 12.687 8.21875 13.3438 8.21875C14.5328 8.21875 15.5 7.27255 15.5 6.10938C15.5 4.9462 14.5328 4 13.3438 4C12.1547 4 11.1875 4.9462 11.1875 6.10938C11.1875 6.37743 11.2439 6.6317 11.3375 6.86777L7.77044 8.96753C7.37499 8.52663 6.80162 8.24219 6.15625 8.24219C4.96722 8.24219 4 9.18838 4 10.3516C4 11.5147 4.96722 12.4609 6.15625 12.4609C6.87811 12.4609 7.51447 12.1092 7.90605 11.5749L11.2932 13.2716C11.2308 13.4686 11.1875 13.6738 11.1875 13.8906C11.1875 15.0538 12.1547 16 13.3438 16C14.5328 16 15.5 15.0538 15.5 13.8906C15.5 12.7274 14.5328 11.7812 13.3438 11.7812Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <button>Add to Explore</button>
              </div>
            </div>

            <!-- Text Button -->
            <div class="relative group">
              <!-- Share Button -->
              <button
                @click=""
                class="flex justify-center items-center w-8 h-8 rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="20" height="20" rx="4" fill="white"/>
                  <path d="M15.9716 4.16699H4.86046C4.47852 4.16699 4.16602 4.47582 4.16602 4.85327V6.91209C4.16602 7.28954 4.47852 7.59836 4.86046 7.59836C5.2424 7.59836 5.5549 7.28954 5.5549 6.91209V5.53954H9.72157V14.4611H8.33268C7.95074 14.4611 7.63824 14.7699 7.63824 15.1474C7.63824 15.5248 7.95074 15.8337 8.33268 15.8337H12.4993C12.8813 15.8337 13.1938 15.5248 13.1938 15.1474C13.1938 14.7699 12.8813 14.4611 12.4993 14.4611H11.1105V5.53954H15.2771V6.91209C15.2771 7.28954 15.5896 7.59836 15.9716 7.59836C16.3535 7.59836 16.666 7.28954 16.666 6.91209V4.85327C16.666 4.47582 16.3535 4.16699 15.9716 4.16699Z" fill="#474747"/>
                </svg>
              </button>

              <!-- Tooltip -->
              <div
                @click=""
                class="absolute mb-2 top-0 -right-18.5 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white text-blue-600 rounded-full shadow-lg px-4 py-1 text-sm font-small flex items-center gap-1 transition-all duration-300 whitespace-nowrap"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="20" height="20" rx="4" fill="blue"/>
                  <path d="M15.9716 4.16699H4.86046C4.47852 4.16699 4.16602 4.47582 4.16602 4.85327V6.91209C4.16602 7.28954 4.47852 7.59836 4.86046 7.59836C5.2424 7.59836 5.5549 7.28954 5.5549 6.91209V5.53954H9.72157V14.4611H8.33268C7.95074 14.4611 7.63824 14.7699 7.63824 15.1474C7.63824 15.5248 7.95074 15.8337 8.33268 15.8337H12.4993C12.8813 15.8337 13.1938 15.5248 13.1938 15.1474C13.1938 14.7699 12.8813 14.4611 12.4993 14.4611H11.1105V5.53954H15.2771V6.91209C15.2771 7.28954 15.5896 7.59836 15.9716 7.59836C16.3535 7.59836 16.666 7.28954 16.666 6.91209V4.85327C16.666 4.47582 16.3535 4.16699 15.9716 4.16699Z" fill="#FFFFFF"/>
                </svg>
                <button>Copy prompt</button>
              </div>
            </div>

            <!-- Like Button -->
            <button
              @click=""
              class="flex justify-center items-center w-8 h-8 bg-gray-600 text-white border border-gray-300 rounded-full shadow-md hover:shadow-lg hover:bg-black transition duration-300"
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

        <!-- Dropdown used v-for options -->

        <div class="px-6 mx-auto w-full flex justify-center">
          <div class="grid grid-cols-1 gap-4 w-full sm:w-64 md:w-80 lg:w-full">
            <!-- Dropdown for Text to Image -->

            <div class="relative">
              <!-- Dropdown Button -->

              <button
                @click="isImageDropdownOpen = !isImageDropdownOpen"
                class="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-gray-100 border border-gray-300 text-sm text-black focus:ring-2 focus:ring-blue-500"
              >
                <div class="flex items-center gap-2">
                  <img
                    v-if="activeMode && selectedLabel"
                    :src="selectedImageDropDown"
                    alt="Selected Option Icon"
                    class="h-5 w-5"
                  />

                  <span>{{ selectedLabel || 'Select Functionality' }}</span>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div v-if="activeMode === 'image'" class="relative">
                <!-- Dropdown Options -->

                <div
                  v-show="isImageDropdownOpen"
                  @click.outside="isImageDropdownOpen = false"
                  class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
                  <div
                    v-for="option in imageModeOptions"
                    :key="option.id"
                    class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    :class="{ selected: activeFunctionality === option.text }"
                    @click="selectImageOption(option)"
                  >
                    <img :src="option.imageSrc" alt="Text to Image Icon" class="h-5 w-5" />

                    <span>{{ option.text }}</span>
                  </div>
                </div>
              </div>

              <div v-if="activeMode === 'video'" class="relative">
                <!-- Dropdown Options -->

                <div
                  v-show="isImageDropdownOpen"
                  @click.outside="isImageDropdownOpen = false"
                  class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
                  <div
                    v-for="videoOption in videoModeOptions"
                    :key="videoOption.id"
                    class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    :class="{ selected: activeFunctionality === videoOption.text }"
                    @click="selectVideoOption(videoOption)"
                  >
                    <img :src="videoOption.imageSrc" :alt="videoOption.text" class="h-5 w-5" />

                    <span>{{ videoOption.text }}</span>
                  </div>
                </div>
              </div>
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
    <ShowModalForImage :isOpen="showImageModal" @close="closeImageModal" :image="selectedImage" />
    <PreviewImageModal
      :isOpen="showPreviewModal"
      @close="closePreviewModal"
      :image="selectedImage"
    />

    <!--
    <ShowModalWithDownloadButton :isOpen="showModal" @close="closeModal" :image="selectedImage" /> -->
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* Custom fractional row span */
.row-span-1-5 {
  grid-row: span 2 / span 1;
  /* Span 1.5 rows */
}
</style>
