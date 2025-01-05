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







//Dropdown property 





const activeModeDropDown = ref('image')

const isImageDropdownOpen = ref(false)

const selectedLabel = ref(null)

const selectedImageDropDown = ref(null)



function selectImageOption(option) {

  selectedLabel.value = option.text; // Update the selected label

  selectedImageDropDown.value = option.imageSrc; // Update the selected image

  activeFunctionality.value = option.text;

  isImageDropdownOpen.value = false; // Close the dropdown

}



function selectVideoOption(option) {

  selectedLabel.value = option.text; // Update the selected label

  selectedImageDropDown.value = option.imageSrc; // Update the selected image

  activeFunctionality.value = option.text;

  isImageDropdownOpen.value = false; // Close the dropdown

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

    } catch (error) { }

  }



  selectImageOption(imageModeOptions[0]);



  fetchMedia('text-to-image') // Initial load

})
const videoModeOptions = [

  {

    id: "21",

    imageSrc: "/public/images/icon/text-to-video.svg",

    text: "Text to Video",

  },

  {

    id: "22",

    imageSrc: "/public/images/icon/image-to-video.svg",

    text: "Image to Video",

  },

  {

    id: "23",

    imageSrc: "/public/images/icon/face-swap.svg",

    text: "Face Swap",

  },

  {

    id: "24",

    imageSrc: "/public/images/icon/templates.svg",

    text: "Templates",

  },



];



const imageModeOptions = [

  {

    id: "11",

    imageSrc: "/public/images/icon/image-to-image.svg",

    text: "Image to Image",

  },

  {

    id: "12",

    imageSrc: "/public/images/icon/text-to-image.svg",

    text: "Text to Image",

  },

];


</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />



    <div class="flex flex-col sm:flex-row sm:flex-wrap w-full">

      <!-- Left Section: Image Grid -->

      <!-- Left Section: Image Grid -->

      <div class="flex-1 bg-white overflow-hidden p-6 ml-15 mt-15 mr-10">

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-full"
          style="grid-template-rows: repeat(3, 1fr); max-height: calc(100vh - 80px)">

          <!-- Display spinner while loading images -->

          <div v-if="loading" class="flex justify-center items-center col-span-full row-span-full">

            <fwb-spinner size="12" />

          </div>



          <!-- Render media or placeholders to ensure 12 grids -->

          <div v-for="index in 12" :key="index"
            class="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white flex items-center justify-center"
            @click="

              activeFunctionality === 'Face Swap' &&

              media[index - 1] &&

              openImageModal(media[index - 1])

              ">

            <!-- Render Image -->

            <img v-if="media[index - 1] && media[index - 1].type === 'image'" :src="media[index - 1].url"
              :alt="'Media ' + (index - 1)" class="w-full h-full object-contain max-w-full" />

            <!-- Render Video -->

            <video v-else-if="media[index - 1] && media[index - 1].type === 'video'" :src="media[index - 1].url"
              controls class="w-full h-full object-contain max-w-full"></video>

            <!-- Render Placeholder -->

            <div v-else class="w-full h-full flex justify-center items-center bg-gray-100 text-gray-400"></div>

          </div>

        </div>

        <!-- Floating Buttons Section -->

        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex">

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
                    class="h-5 w-5">

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

                    <img :src="option.imageSrc" alt="Text to Image Icon" class="h-5 w-5">

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

                    <img :src="videoOption.imageSrc" :alt="videoOption.text" class="h-5 w-5">

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
    <ShowModalForImage :isOpen="showModal" @close="closeModal" :image="selectedImage" />
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
