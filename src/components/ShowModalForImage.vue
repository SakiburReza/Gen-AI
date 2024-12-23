<script setup lang="ts">
import { computed } from 'vue'

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
})

// Emits
const emit = defineEmits(['close'])

// Methods
const close = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative flex flex-col md:flex-row">
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <!-- Image Section (Left) -->
      <div class="md:w-1/2 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        <div v-if="image?.type === 'image'" class="w-full h-auto">
          <img :src="image.url" alt="Selected Image" class="object-contain max-w-full h-60" />
        </div>
        <div v-else-if="image?.type === 'video'" class="w-full h-auto">
          <video :src="image.url" controls class="object-contain max-w-full h-auto"></video>
        </div>
      </div>

      <!-- Details Section (Right) -->
      <div class="md:w-1/2 bg-white rounded-lg p-6 flex flex-col justify-between">
        <!-- Title -->
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Photo Details</h3>

        <!-- Prompt -->
        <div class="mb-6">
          <p class="text-gray-600 font-bold text-sm mb-1">Prompt:</p>
          <p class="text-sm text-gray-600">
            A bottom-up image of a girl walking confidently down the city streets
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <button
            class="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Turn into Video
          </button>
          <button
            class="bg-gray-200 text-sm text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Image Reference
          </button>
        </div>

        <!-- Download Link -->
        <div class="text-center">
          <a
            href="#"
            class="inline-flex items-center justify-center text-blue-600 font-semibold text-sm"
          >
            <img
              src="/public/images/icon/downloadButton.svg"
              alt="Download Icon"
              class="w-5 h-5 mr-2"
            />
            DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling adjustments */
</style>
