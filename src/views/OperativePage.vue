<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import FacilityCard from '@/components/FacilityCard.vue'
import CustomizationCard from '@/components/CustomizationCard.vue'
import DescriptionCard from '@/components/DescriptionCard.vue'
import ImageInputCard from '@/components/ImageInputCard.vue'
import { FwbButton, FwbSpinner, FwbCard } from 'flowbite-vue'
import { ref, onMounted, watch } from 'vue'
import genAiService from '@/services/gen-ai'

// States to store images from the ImageInputCard components
const referenceImage = ref<File | null>(null)
const faceImage = ref<File | null>(null)

// States
const description = ref('')
const media = ref<{ url: string; type: 'image' | 'video' }[]>([]) // Array to store media
const loading = ref(false) // Track loading state

// Active functionality state
const activeFunctionality = ref<
  'Text to Image' | 'Face Swap' | 'Text to Video' | 'Image to Video' | 'Image to Image'
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
  }
})

// Utility: Convert Base64 to Blob URL
function base64ToBlobUrl(base64: string): string {
  const arr = base64.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)

  if (!mimeMatch) {
    throw new Error('Invalid base64 string')
  }

  const mime = mimeMatch[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  const blob = new Blob([u8arr], { type: mime })
  return URL.createObjectURL(blob) // Convert Blob to a URL
}

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

const generateImage = async () => {
  loading.value = true

  try {
    let response

    if (activeFunctionality.value === 'Face Swap') {
      // Prepare form data for face swap
      const formData = new FormData()
      formData.append('targetImage', referenceImage.value!)
      formData.append('swapImage', faceImage.value!)

      response = await genAiService.faceSwap(formData)
    } else if (activeFunctionality.value === 'Text to Image') {
      response = await genAiService.textToImage({ text: description.value })
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
      response = await genAiService.imageToImage(formData)
    }
    if (response?.data?.status) {
      const base64Content = response.data.data.content

      // Determine the media type based on base64 content
      const mediaType = base64Content.startsWith('data:video/mp4;') ? 'video' : 'image'
      const newMedia = {
        url: base64ToBlobUrl(base64Content, mediaType), // Convert base64 to Blob URL
        type: mediaType,
      }

      // Prepend the new media and maintain the list size at 12
      media.value = [newMedia, ...media.value].slice(0, 12)
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
onMounted(() => {
  fetchMedia('text-to-image') // Initial load
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar :title="activeFunctionality" />

    <div class="flex flex-1 overflow-auto">
      <!-- Left Section: Image Grid -->
      <div class="flex-1 bg-white overflow-y-auto p-10 mt-10 ml-10">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 grid-rows-2 sm:grid-rows-3 md:grid-rows-4"
        >
          <!-- Display spinner while loading images -->
          <div v-if="loading" class="flex justify-center items-center col-span-4">
            <fwb-spinner size="12" />
          </div>

          <!-- Display all contents -->
          <div
            v-for="(media, index) in media"
            :key="index"
            class="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white"
          >
            <!-- Render Image -->
            <img
              v-if="media.type === 'image'"
              :src="media.url"
              :alt="'Media ' + index"
              class="w-full h-full object-contain"
            />
            <!-- Render Video -->
            <video
              v-else-if="media.type === 'video'"
              :src="media.url"
              controls
              class="w-full h-full object-contain"
            ></video>
          </div>
        </div>
      </div>

      <!-- Right Section: Facility Card and Dynamic Content -->
      <div class="w-full sm:w-[30%] p-6 flex-shrink-0">
        <!-- Facility Card -->
        <div class="p-6">
          <fwb-card class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
            <!-- Removed the w-1/4 class, so it takes only the required width -->
            <div class="rounded-lg p-5">
              <div class="grid grid-cols-2 gap-4">
                <!-- Text to Image-->
                <div
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2"
                  @click="changeFunctionality('Text to Image')"
                >
                  <span class="text-gray-900 font-medium">Text to Image</span>
                </div>

                <!-- Image to Video -->
                <div
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2"
                  @click="changeFunctionality('Image to Video')"
                >
                  <span class="text-gray-800 font-medium">Image to Video</span>
                  <svg
                    width="35"
                    height="25"
                    viewBox="0 0 35 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <rect width="35" height="25" fill="url(#pattern0_107_1447)" />
                    <defs>
                      <pattern
                        id="pattern0_107_1447"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_107_1447"
                          transform="matrix(0.00454545 0 0 0.00636364 0 -0.00590909)"
                        />
                      </pattern>
                      <image
                        id="image0_107_1447"
                        width="220"
                        height="159"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>

                <!-- Text to Video -->
                <div
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2"
                  @click="changeFunctionality('Text to Video')"
                >
                  <span class="text-gray-800 font-medium">Text to Video</span>
                  <svg
                    width="28"
                    height="26"
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <rect width="28" height="26" fill="url(#pattern0_107_1449)" />
                    <defs>
                      <pattern
                        id="pattern0_107_1449"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          xlink:href="#image0_107_1449"
                          transform="matrix(0.00526316 0 0 0.00566802 0 -0.00161943)"
                        />
                      </pattern>
                      <image
                        id="image0_107_1449"
                        width="190"
                        height="177"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>

                <!-- Face Swap -->
                <div
                  @click="changeFunctionality('Face Swap')"
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2"
                >
                  <span class="text-gray-900 font-medium">Face Swap</span>
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <rect
                      width="23"
                      height="23"
                      transform="matrix(-1 0 0 1 23 0)"
                      fill="url(#pattern0_107_1448)"
                    />
                    <defs>
                      <pattern
                        id="pattern0_107_1448"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use xlink:href="#image0_107_1448" transform="scale(0.00571429)" />
                      </pattern>
                      <image
                        id="image0_107_1448"
                        width="175"
                        height="175"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </div>
                <!-- Image to Image -->
                <div
                  class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2"
                  @click="changeFunctionality('Image to Image')"
                >
                  <span class="text-gray-800 font-medium">Image to Image</span>
                </div>
              </div>
            </div>
          </fwb-card>
        </div>
        <!-- Dynamic Content Based on Selected Functionality -->
        <div
          v-if="activeFunctionality === 'Text to Image'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <CustomizationCard />
          <DescriptionCard @input="(value) => (description = value)" />
          <fwb-button
            @click="generateImage"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>

        <div
          v-if="activeFunctionality === 'Face Swap'"
          class="bg-white p-6 space-y-6 flex-shrink-0"
        >
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard
            title="Insert Reference Image"
            @input="(file) => (referenceImage = file)"
          />
          <ImageInputCard title="Insert Face Image" @input="(file) => (faceImage = file)" />

          <fwb-button
            @click="generateImage"
            class="w-full sm:w-64 md:w-80 lg:w-full"
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
            @click="generateImage"
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
            @click="generateImage"
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
          <!-- Modify ImageInputCard to bind the selected images -->
          <ImageInputCard title="Insert Image" @input="(file) => (referenceImage = file)" />
          <DescriptionCard @input="(value) => (description = value)" />

          <fwb-button
            @click="generateImage"
            class="w-full sm:w-64 md:w-80 lg:w-full"
            color="default"
          >
            Zeuxis
          </fwb-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional Custom Styles */
</style>
