<script setup lang="ts">
import CustomizationCard from '@/components/CustomizationCard.vue'
import DescriptionCard from '@/components/DescriptionCard.vue'
import ImageInputCard from '@/components/ImageInputCard.vue'
import Navbar from '@/components/NavBar.vue'
import ShowModalForImage from '@/components/ShowModalForImage.vue'
import VideoCarousel from '@/components/VideoCarousel.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { ref, watch, onMounted, computed } from 'vue'
import { FwbButton, FwbCard, FwbSpinner } from 'flowbite-vue'
import { useRoute, useRouter } from 'vue-router'
import { useCredits } from '@/utils/utils'
import { imageUrl } from '@/utils/utils'
import PreviewImageModal from '@/components/PreviewImageModal.vue'

const { fetchCredits } = useCredits()

const searchQuery = ref('')

const route = useRoute()

// Reactive state for modal
const isModalOpen = ref(false)
const action = ref(null)
const selectedImageUrl = ref(null)

// Dynamic action text for modal content
const actionText = computed(() => {
  if (action.value === 'Y') return 'Add to Explore'
  if (action.value === 'N') return 'Unexplore'
  if (action.value === 'delete') return 'Delete'
  return ''
})

// Function to open the modal and set action + image URL
const openModal = (imageUrl, selectedAction) => {
  selectedImageUrl.value = imageUrl
  action.value = selectedAction
  isModalOpen.value = true
}

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false
  action.value = null
  selectedImageUrl.value = null
}

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

const isLikedState = ref(false);
// States

const description = ref('')

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

const aiGeneratedMedia = ref<
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
const activeFunctionality = ref<string>('Text to Image')

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

const deleteAction = async (imageId) => {
  const { data: response } = await genAiService.deleteMedia(imageId)
  if (response.status) {
    toastStore.success('Deleted successfully')
    // Remove the deleted item from the mediaItems array
    // Find the index of the item to be deleted
    const itemIndex = media.value.findIndex((item) => item.url === imageId)
    if (itemIndex !== -1) {
      // Remove the item from the media array
      media.value.splice(itemIndex, 1) // Removes the item at the found index

      // Trigger reactivity by updating the media array
      media.value = [...media.value] // This will reassign and trigger reactivity
    }
  }
}

// Fetch Images / Videos from API
const togglefetchMedia = async (label: string) => {
  if (isLikedState.value) {
      // Call fetchMedia function if liked
      await fetchMedia(label);
    } else {
      // Call fetchLikedMedia function if not liked
      await fetchLikedMedia(label);
    }

    // Toggle the isLiked state
    isLikedState.value = !isLikedState.value;
}

const fetchMedia = async (label: string) => {
  loading.value = true
  if (label === 'Text to Image') label = 'text-to-image'
  else if (label === 'Image to Image') label = 'image-to-image'
  else if (label === 'Text to Video') label = 'text-to-video'
  else if (label === 'Image to Video') label = 'image-to-video'
  else if (label === 'Face Swap') label = 'face-swap'
  else if (label === 'Templates') label = 'template-video'

  try {
    const { data: response } = await genAiService.getMedia(label)

    if (response.status && Array.isArray(response.data)) {
      // Map data with type detection (image/video) for initial load

      media.value = response.data.map((item) => ({
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

const fetchLikedMedia = async (label: string) => {
  loading.value = true
  if (label === 'Text to Image') label = 'text-to-image'
  else if (label === 'Image to Image') label = 'image-to-image'

  try {
    const { data: response } = await genAiService.getLikedMedia(label)

    if (response.status && Array.isArray(response.data)) {
      // Map data with type detection (image/video) for initial load

      media.value = response.data.map((item) => ({
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

      aiGeneratedMedia.value = response.data.data.map((item) => ({
        url: item.content,
        type: item.type,
        orientation: item.orientation,
        prompt: item.prompt,
      }))
      media.value.unshift(...aiGeneratedMedia.value)
    } else {
      console.error('Failed to generate media:', response)
    }
  } catch (error) {
    console.error('Error generating media:', error)
  } finally {
    loading.value = false
  }
}
const confirmAction = async () => {
  if (!selectedImageUrl.value || !action.value) return

  try {
    console.log(`Action: ${action.value}, Image URL: ${selectedImageUrl.value}`)
    let response

    if (action.value === 'delete') {
      response = await deleteAction(selectedImageUrl.value)
      closeModal() // Close the modal after successful action
    } else {
      response = await shareAction(selectedImageUrl.value, action.value)
      closeModal() // Close the modal after successful action
    }

    console.log('Response:', response.data.message)
    toastStore.success(response.data.message)

    closeModal() // Close the modal after successful action
  } catch (error) {
    console.error('Error confirming action:', error)
  }
}
const shareAction = async (imageId: string, action: 'Y' | 'N') => {
  try {
    const response = await genAiService.shareImage({ imageId: imageId, isShare: action })
    if (response.status === 200) {
      const itemIndex = media.value.findIndex((item) => item.url === imageId)
      if (itemIndex !== -1) {
        media.value[itemIndex].isShared = action
        media.value = [...media.value]
      }

      console.log('Image shared successfully:', response.data)
      toastStore.success(response.data.message)
    }
  } catch (error) {
    console.error('Error sharing the image:', error)
  }
}
const likeAction = async (imageId: string, action: 'Y' | 'N') => {
  try {
    const response = await genAiService.likeImage({ imageId: imageId, isLike: action })
    if (response.status === 200) {
      const itemIndex = media.value.findIndex((item) => item.url === imageId)
      if (itemIndex !== -1) {
        media.value[itemIndex].isLiked = action
        media.value = [...media.value]
      }
      console.log('Image Liked successfully:', response.data)
      toastStore.success(response.data.message)
    }
  } catch (error) {
    console.error('Error sharing the image:', error)
  }
}

const copyAction = async (prompt: string) => {
  console.log('ssss')
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

// const filteredMedia = computed(() =>
//   media.value.filter((item) => item.prompt.toLowerCase().includes(searchQuery.value.toLowerCase())),
// )
const filteredMedia = computed(() => {
  // If searchQuery is null or empty, return the entire media array
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return media.value;
  }
  return media.value.filter((item) => {
    const prompt = item.prompt ? item.prompt.toLowerCase() : ''; // Safely handle null prompts
    return prompt.includes(searchQuery.value.toLowerCase());
  });
});

const router = useRouter()

const goToExplore = () => {
  router.push('/communitypage')
}

//Dropdown property

// const activeModeDropDown = ref('image')

const isImageDropdownOpen = ref(false)

const selectedLabel = ref('Text to Image')

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
  // console.log(route.query.checkoutId)

  // if (route.query) {
  //   try {
  //     const checkoutId = route.query.checkoutId

  //     const transactionId = route.query.transactionId

  //     console.log('checkoutId :', checkoutId, 'transactionId:', transactionId)

  //     if (checkoutId && transactionId) {
  //       const response = await genAiService.getPaymentSync(checkoutId, transactionId)

  //       toastStore.success(response.data)
  //     }
  //   } catch (error) {}
  // }

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
    imageSrc: '/public/images/icon/text-to-image.svg',
    text: 'Text to Image',
  },
  {
    id: '12',
    imageSrc: '/public/images/icon/image-to-image.svg',
    text: 'Image to Image',
  },
]

</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="flex items-center w-full space-x-4 pr-16 justify-between">
      <!-- Explore Button -->
      <button type="button" @click="goToExplore"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ml-15">
        < Explore </button>

          <!-- Search Input -->
          <div class="flex-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>

          <!-- Heart Button -->
          <button @click="togglefetchMedia(activeFunctionality)"
            class="w-12 h-12 flex justify-center items-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="currentColor"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.485 8.485a.75.75 0 001.06 0l8.485-8.485a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
    </div>

    <div class="flex flex-col sm:flex-row sm:flex-wrap w-full">
      <!-- Left Section: Enhanced Image Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:w-[65%] ml-15 mb-5 mt-6 overflow-y-auto pr-2">
        <!-- Display spinner while loading images -->
        <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">
          <fwb-spinner size="12" />
        </div>
        <div v-for="(item, index) in filteredMedia" :key="index" class="relative overflow-hidden rounded-lg" :class="[
          item.orientation === 'P' ? 'row-span-2' : 'row-span-1',
          'shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300',
        ]" @click="
            activeFunctionality === 'Face Swap' && media[index] && openImageModal(media[index])
            ">
          <!-- Render Image -->

          <img v-if="media[index] && media[index].type === 'image'" :src="imageUrl() + item.url" :alt="'Media ' + index"
            class="h-full max-w-full rounded-lg w-full"
            :class="[item.orientation === 'P' ? 'object-full' : 'object-cover']" @click="
              (activeFunctionality === 'Image to Image' ||
                activeFunctionality === 'Text to Image') &&
              media[index] &&
              openPreviewModal(media[index])
              " />

          <!-- Render Video -->

          <video v-else-if="media[index] && media[index].type === 'video'" :src="imageUrl() + media[index].url" controls
            class="w-full h-full object-contain max-w-full" @click="
              (activeFunctionality === 'Text to Video' ||
                activeFunctionality === 'Image to Video' ||
                activeFunctionality === 'Templates') &&
              media[index] &&
              openPreviewModal(media[index])
              "></video>

          <!------------------------------------------------------ Roney ----------------------------------------->
          <!-- Floating Social Buttons -->
          <div v-if="media[index] && media[index].type === 'image'"
            class="absolute bottom-2 right-2 flex flex-col gap-2 items-center">
            <!-- Share Button with Group Class -->
            <div class="relative group">
              <!-- Share Button -->
              <button
                @click="openModal(media[index].url, media[index].isShared === 'N' ? 'Y' : 'N')"
                :class="[
                  'flex justify-center items-center w-8 h-8 rounded-full shadow-md hover:shadow-lg border border-gray-300 transition duration-300',
                  media[index].isShared === 'Y' ? 'bg-white text-black' : 'bg-gray-600 text-white',
                ]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4583 10.375C11.5115 10.375 10.6771 10.8307 10.153 11.5236L5.6219 9.25387C5.69713 9.00303 5.75 8.74306 5.75 8.46875C5.75 8.09669 5.67202 7.74297 5.53731 7.41762L10.2793 4.62612C10.807 5.232 11.5827 5.625 12.4583 5.625C14.0437 5.625 15.3333 4.36341 15.3333 2.8125C15.3333 1.26159 14.0437 0 12.4583 0C10.873 0 9.58333 1.26159 9.58333 2.8125C9.58333 3.16991 9.65856 3.50894 9.78337 3.82369L5.02726 6.62337C4.49998 6.0355 3.73549 5.65625 2.875 5.65625C1.28963 5.65625 0 6.91784 0 8.46875C0 10.0197 1.28963 11.2812 2.875 11.2812C3.83749 11.2812 4.68596 10.8122 5.20806 10.0998L9.72424 12.3622C9.64106 12.6248 9.58333 12.8984 9.58333 13.1875C9.58333 14.7384 10.873 16 12.4583 16C14.0437 16 15.3333 14.7384 15.3333 13.1875C15.3333 11.6366 14.0437 10.375 12.4583 10.375Z"
                    :fill="media[index].isShared === 'Y' ? 'blue' : 'white'"
                  />
                </svg>
              </button>
            </div>

            <!-- Text Button -->
            <div class="relative group">
              <!-- Copy -->
              <button @click="copyAction(media[index].prompt)"
                class="flex justify-center items-center w-8 h-8 rounded-full shadow-md hover:shadow-lg hover:bg-gray-600 bg-gray-600 text-white border border-gray-300 transition duration-300">
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.1111 0H0.888889C0.4 0 0 0.395294 0 0.878431V3.51373C0 3.99686 0.4 4.39216 0.888889 4.39216C1.37778 4.39216 1.77778 3.99686 1.77778 3.51373V1.75686H7.11111V13.1765H5.33333C4.84444 13.1765 4.44444 13.5718 4.44444 14.0549C4.44444 14.538 4.84444 14.9333 5.33333 14.9333H10.6667C11.1556 14.9333 11.5556 14.538 11.5556 14.0549C11.5556 13.5718 11.1556 13.1765 10.6667 13.1765H8.88889V1.75686H14.2222V3.51373C14.2222 3.99686 14.6222 4.39216 15.1111 4.39216C15.6 4.39216 16 3.99686 16 3.51373V0.878431C16 0.395294 15.6 0 15.1111 0Z"
                    fill="white" />
                </svg>
              </button>
            </div>

            <!-- Like Button -->
            <div class="relative group">
              <button
                @click="
                  likeAction(
                    media[index].url,
                    media[index].isLiked === 'N' || media[index].isLiked === null ? 'Y' : 'N',
                  )
                "
                :class="[
                  'flex justify-center items-center w-8 h-8 rounded-full shadow-md hover:shadow-lg border border-gray-300 transition duration-300',
                  media[index].isLiked === 'Y' ? 'bg-white text-red' : 'bg-gray-600 text-white',
                ]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="media[index].isLiked === 'Y' ? 'fill-red' : 'fill-white'"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.485 8.485a.75.75 0 001.06 0l8.485-8.485a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              </button>
            </div>
            <!-- Delete Button -->
            <button
              @click="openModal(media[index].url, 'delete')"
              class="flex justify-center items-center w-8 h-8 bg-gray-600 text-white border border-gray-300 rounded-full shadow-md hover:shadow-lg hover:bg-black transition duration-300"
            >
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.975098 4.6875L1.80538 14.7105C1.86488 15.4333 2.48057 16 3.20613 16H10.8563C11.5818 16 12.1975 15.4333 12.257 14.7105L13.0873 4.6875H0.975098ZM4.687 14.125C4.44163 14.125 4.23519 13.9341 4.21963 13.6855L3.75088 6.12303C3.73485 5.86441 3.93122 5.64194 4.18941 5.62591C4.45719 5.60713 4.67007 5.80581 4.68653 6.06444L5.15528 13.6269C5.17188 13.8948 4.95997 14.125 4.687 14.125ZM7.49994 13.6562C7.49994 13.9153 7.29029 14.125 7.03119 14.125C6.7721 14.125 6.56244 13.9153 6.56244 13.6562V6.09375C6.56244 5.83466 6.7721 5.625 7.03119 5.625C7.29029 5.625 7.49994 5.83466 7.49994 6.09375V13.6562ZM10.3115 6.12306L9.84275 13.6856C9.82735 13.9316 9.62225 14.1367 9.34563 14.1241C9.08744 14.1081 8.89107 13.8856 8.9071 13.627L9.37585 6.06447C9.39188 5.80584 9.61847 5.61769 9.87297 5.62594C10.1312 5.64197 10.3275 5.86444 10.3115 6.12306Z"
                  fill="white" />
                <path
                  d="M13.125 1.875H10.3125V1.40625C10.3125 0.630813 9.68169 0 8.90625 0H5.15625C4.38081 0 3.75 0.630813 3.75 1.40625V1.875H0.9375C0.419719 1.875 0 2.29472 0 2.8125C0 3.33022 0.419719 3.75 0.9375 3.75C5.24894 3.75 8.81372 3.75 13.125 3.75C13.6428 3.75 14.0625 3.33022 14.0625 2.8125C14.0625 2.29472 13.6428 1.875 13.125 1.875ZM9.375 1.875H4.6875V1.40625C4.6875 1.14762 4.89762 0.9375 5.15625 0.9375H8.90625C9.16488 0.9375 9.375 1.14762 9.375 1.40625V1.875Z"
                  fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>


      <!-- Floating Buttons Section -->

      <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex z-50">
        <!-- Image Button -->

        <button @click="setActive('image')" :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition',

          activeMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
        ]">
          <span class="material-icons">image</span>
        </button>

        <!-- Video Button -->

        <button @click="setActive('video')" :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition',

          activeMode === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500',
        ]">
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

              <button @click="isImageDropdownOpen = !isImageDropdownOpen"
                class="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-gray-100 border border-gray-300 text-sm text-black focus:ring-2 focus:ring-blue-500">
                <div class="flex items-center gap-2">
                  <img v-if="activeMode && selectedLabel" :src="selectedImageDropDown" alt="Selected Option Icon"
                    class="h-5 w-5" />

                  <span>{{ selectedLabel || 'Select Functionality' }}</span>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <div v-if="activeMode === 'image'" class="relative">
                <!-- Dropdown Options -->

                <div v-show="isImageDropdownOpen" @click.outside="isImageDropdownOpen = false"
                  class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div v-for="option in imageModeOptions" :key="option.id"
                    class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    :class="{ selected: activeFunctionality === option.text }" @click="selectImageOption(option)">
                    <img :src="option.imageSrc" alt="Text to Image Icon" class="h-5 w-5" />

                    <span>{{ option.text }}</span>
                  </div>
                </div>
              </div>

              <div v-if="activeMode === 'video'" class="relative">
                <!-- Dropdown Options -->

                <div v-show="isImageDropdownOpen" @click.outside="isImageDropdownOpen = false"
                  class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div v-for="videoOption in videoModeOptions" :key="videoOption.id"
                    class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    :class="{ selected: activeFunctionality === videoOption.text }"
                    @click="selectVideoOption(videoOption)">
                    <img :src="videoOption.imageSrc" :alt="videoOption.text" class="h-5 w-5" />

                    <span>{{ videoOption.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Dynamic Content Based on Selected Functionality -->
        <div v-if="activeFunctionality === 'Text to Image'" class="bg-white p-6 space-y-6 flex-shrink-0">
          <CustomizationCard @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)" />
          <DescriptionCard @input="(value) => (description = value)" />
          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
            Zeux IT
          </fwb-button>
        </div>

        <div v-if="activeFunctionality === 'Face Swap'" class="bg-white p-6 space-y-6 flex-shrink-0 relative">
          <!-- Image Cards with Sequencial Positioning -->
          <div class="w-full space-y-6">
            <!-- First Image Card -->
            <div class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl bg-gray-200 rounded-lg shadow-lg">
              <ImageInputCard title="Insert Reference Face Image" @input="(file) => (referenceImage = file)" />
            </div>
            <!-- Second Image Card -->
            <div class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl bg-white rounded-lg shadow-2xl">
              <ImageInputCard title="Insert Face Image" @input="(file) => (faceImage = file)" />
            </div>
          </div>

          <CustomizationCard @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)" />
          <!-- Generate Button -->
          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full mt-8" color="default">
            Zeuxis
          </fwb-button>
        </div>
        <div v-if="activeFunctionality === 'Text to Video'" class="bg-white p-6 space-y-6 flex-shrink-0">
          <DescriptionCard @input="(value) => (description = value)" />
          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
            Zeuxis
          </fwb-button>
        </div>
        <div v-if="activeFunctionality === 'Image to Video'" class="bg-white p-6 space-y-6 flex-shrink-0">
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard title="Insert Image" @input="(file) => (referenceImage = file)" />
          <DescriptionCard @input="(value) => (description = value)" />

          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
            Zeuxis
          </fwb-button>
        </div>
        <div v-if="activeFunctionality === 'Image to Image'" class="bg-white p-6 space-y-6 flex-shrink-0">
          <CustomizationCard @selectRatio="(ratio) => (selectedRatio = ratio)"
            @selectOutput="(output) => (selectedOutput = output)" />
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard title="Insert Image" @input="(file) => (referenceImage = file)" />
          <DescriptionCard @input="(value) => (description = value)" />

          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
            Zeuxis
          </fwb-button>
        </div>
        <div v-if="activeFunctionality === 'Templates'" class="bg-white p-6 space-y-6 flex-shrink-0">
          <!-- Video Carousel -->
          <VideoCarousel @video-selected="(object) => (selectedVideo = object)" />

          <ImageInputCard title="Face Image" @input="(file) => (referenceImage = file)" />
          <fwb-button @click="generateAiContent" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
            Zeuxis
          </fwb-button>
        </div>
      </div>
    </div>
    <!-- Modal Component -->
    <ShowModalForImage :isOpen="showImageModal" @close="closeImageModal" :image="selectedImage" />
    <PreviewImageModal :isOpen="showPreviewModal" @close="closePreviewModal" :image="selectedImage" />

    <!--
    <ShowModalWithDownloadButton :isOpen="showModal" @close="closeModal" :image="selectedImage" /> -->
  </div>
  <!-- Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-xl w-96 p-6 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Modal Title -->
      <h2 class="text-lg font-semibold text-gray-800">Confirm Action</h2>

      <!-- Modal Content -->
      <p class="mt-2 text-gray-600">
        Are you sure you want to
        <span
          class="font-bold"
          :class="{
            'text-blue-600': action === 'Y',
            'text-red': action === 'N',
            'text-gray-600': action === 'delete',
          }"
        >
          {{ actionText }}
        </span>
        this item?
      </p>

      <!-- Buttons -->
      <div class="mt-6 flex justify-end gap-3">
        <button @click="closeModal"
          class="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition">
          Cancel
        </button>
        <button
          @click="confirmAction"
          class="px-4 py-2 text-sm text-white rounded-md transition"
          :class="{
            'bg-blue-600 hover:bg-blue-700': action === 'Y',
            'bg-red hover:bg-red': action === 'N',
            'bg-gray-600 hover:bg-gray-700': action === 'delete',
          }"
        >
          Confirm
        </button>
      </div>
    </div>
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
