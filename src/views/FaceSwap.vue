<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import CustomizationCard from '@/components/CustomizationCard.vue'
import DescriptionCard from '@/components/DescriptionCard.vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { ref, onMounted } from 'vue'
import genAiService from '@/services/gen-ai'
import ImageInputCard from '@/components/ImageInputCard.vue'

const description = ref('')
const images = ref<string[]>([]) // Array to store all images
const loading = ref(false) // Track loading state

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

// Fetch Images from API
const fetchImages = async () => {
  loading.value = true // Start loading

  try {
    const { data: response } = await genAiService.getMedia('text-to-image')

    if (response.status && Array.isArray(response.data)) {
      // Extract "image" from each object and convert to Blob URLs
      images.value = response.data.map((item) => base64ToBlobUrl(item.image))
    } else {
      console.error('Failed to fetch images: Invalid response format')
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false // Stop loading
  }
}

// Generate a New Image and Fetch Updated List
const generateImage = async () => {
  const payload = { text: description.value }

  try {
    const { data: response } = await genAiService.getAiGeneratedImage(payload)

    if (response.status) {
      // Refetch images to include the newly generated image
      await fetchImages()
    } else {
      console.error('Failed to generate image:', response)
    }
  } catch (error) {
    console.error('Error generating image:', error)
  }
}

// Fetch images when the component is mounted
onMounted(fetchImages)
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar title="Face Swap" />

    <div class="flex flex-1 overflow-auto flex-col sm:flex-row">
      <!-- Image Grid Section -->
      <div class="flex-1 p-6 bg-white overflow-y-auto pl-30 mt-10">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 h-full">
          <!-- Display spinner while loading images -->
          <div v-if="loading" class="flex justify-center items-center col-span-4">
            <fwb-spinner size="12" />
          </div>

          <!-- Display all images -->
          <div
            v-for="(image, index) in images"
            :key="index"
            class="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white"
          >
            <img :src="image" :alt="'Image ' + index" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <!-- Customization and Description Section -->
      <div class="w-full sm:w-1/4 bg-white p-6 space-y-6 flex-shrink-0 mr-20 mt-10">
        <ImageInputCard title="Insert Reference Image" />
        <ImageInputCard title="Insert Face Image" />

        <fwb-button @click="generateImage" class="w-full sm:w-64 md:w-80 lg:w-full" color="default">
          Zeuxis
        </fwb-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional Custom Styles */
</style>
