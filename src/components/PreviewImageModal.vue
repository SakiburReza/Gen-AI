<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Object as () => { url: string; type: string } | null,
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
const emit = defineEmits(['close']);


// State
const prompt = ref<string | null>(null);

// Helper to extract filename from URL
const getFilename = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'download';
};

const close = () => {
  emit('close');
  prompt.value = "";
};
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click="handleOutsideClick"
    v-if="isOpen">
    <div class="bg-tertiary rounded-lg shadow-lg w-120 max-w-5xl p-6 relative">
      <!-- Close Button -->
      <button @click="close"
        class=" top-2 right-1 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md float-end">
        ✕
      </button>
      <br>

      <!-- Single Column Layout -->
      <div class="flex flex-col gap-6 w-100">
        <!-- Image Section -->
        <div class="w-full">
          <div v-if="image?.type === 'image'" class="w-full">
            <img :src="image.url" alt="Generated Image" class="rounded-lg w-full h-100 object-contain" />

            <a :href="image?.url" :download="image?.url ? getFilename(image.url) : null"
              class="flex items-center justify-center text-blue-600 text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 hover:text-white" >
              <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-2">
              DOWNLOAD
            </a>
          </div>
          <div v-else-if="image?.type === 'video'" class="w-full">
            <video :src="image.url" controls class="w-full h-auto object-contain"></video>
            <a :href="image?.url" :download="image?.url ? getFilename(image.url) : null"
              class="flex items-center justify-center text-blue-600 text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 hover:text-white">
              <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-2">
              DOWNLOAD
            </a>
          </div>
        </div>

        <!-- Details Section -->
        <!-- <div class="bg-white shadow-lg rounded-lg p-6"> -->
          <!-- Title -->
          <!-- <h3 v-if="image?.type === 'image'" class="text-lg font-semibold text-gray-900 mb-4">Image</h3>
          <h3 v-else-if="image?.type === 'video'" class="text-lg font-semibold text-gray-900 mb-4">Video</h3> -->

          <!-- Download Link -->
          <!-- <div class="mt-5 text-center">
            <a :href="image?.url" :download="image?.url ? getFilename(image.url) : null"
              class="flex items-center justify-center text-blue-600 text-sm font-semibold py-2 px-4 rounded hover:bg-gray-100">
              <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-2">
              DOWNLOAD
            </a>
          </div> -->
        <!-- </div> -->
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Optional styling adjustments */
</style>
