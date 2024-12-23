<script setup lang="ts">

// Props
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Object,
    default: null,
  },
  promtsDetails: {
        type: Object,
        default: () => ({
            title: "A bottom-up image of a girl walking confidently down the city streets",            
        }),
    },
})

// Emits
const emit = defineEmits(['close'])

// Methods
const close = () => {
  emit('close')
}

// function handleOutsideClick(event) {
//       if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
//         // Close modal if the click is outside the modal
//         close();
//       }
//     }
// Helper to extract filename from URL
const getFilename = (url: string): string => {
  const parts = url.split('/')
  return parts[parts.length - 1] || 'download'
}


</script>
<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    v-if="isOpen">
    <div
      class="bg-tertiary rounded-lg shadow-lg w-full max-w-5xl p-6 relative"
    >
      <!-- Close Button -->
      <button @click="close" class="absolute top-1 right-1 text-gray-500 hover:text-gray-800">
        ✕
      </button>

      <!-- Two Column Layout -->
      <div class="grid md:grid-cols-3 gap-6 h-full">
        <!-- Image Section -->
        <div class="h-full md:h-auto md:col-span-1 w-full">
          <div v-if="image?.type === 'image'" class="w-full h-full">
            <img :src="image.url" alt="Generated Image" class="rounded-lg w-full h-full object-contain" />
          </div>
          <div v-else-if="image?.type === 'video'" class="w-full h-full">
            <video :src="image.url" controls class="w-full h-full object-contain"></video>
          </div>
        </div>
        <!-- Details Section -->
        <div class="md:col-span-2 bg-white shadow-lg rounded-lg p-15">
          <!-- Title -->
          <h3 v-if="image?.type === 'image'" class="text-sm font-semibold text-gray-900 mb-20">Photo Details</h3>
          <h3 v-else-if="image?.type === 'video'" class="text-sm font-semibold text-gray-900 mb-20">Video Details</h3>
          <!-- Prompt -->
          <div class="mb-7">
            <p class="text-gray-600 font-bold text-sm ">Prompt :</p>
            <p class="text-sm text-silverChalice pt-1 ">
              {{ promtsDetails.title }}
            </p>
          </div>
          <!-- Action Buttons -->
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-start">
            <button class="bg-blue-600 text-white text-xs px-16 py-2 rounded-lg hover:bg-blue-600  md:w-auto">
              Turn into Video
            </button>
            <button
              class="bg-silverChalice text-xs text-black px-16 py-2 rounded-lg hover:bg-silverChalice  md:w-auto mt-4 md:mt-0">
              Image Reference
            </button>
          </div>


          <!-- Download Link -->
          <div class="mt-5 text-center">
            <a :href="image?.url"
            :download="image?.url ? getFilename(image.url) : null" class="flex items-start justify-start text-black text-xs px-1 font-semibold py-3">
              <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-1.5">
              DOWNLOAD
            </a>
          </div>

        </div>

      </div>
    </div>
  </div>



</template>


<style scoped>
/* Optional styling adjustments */
</style>
