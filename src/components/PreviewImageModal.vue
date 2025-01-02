<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Object as () => { url: string } | null,
    default: null,
  },
});

// Emits
const emit = defineEmits(['close']);

// Helper to extract filename from URL
const getFilename = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'download';
};

// Close the modal
const close = () => {
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click.self="close" v-if="isOpen">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
      <!-- Close Button -->
      <button @click="close" class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md">
        ✕
      </button>

      <!-- Download Link -->
      <div class="mt-5 text-center">
        <a :href="image?.url" :download="image?.url ? getFilename(image.url) : null" class="flex items-center justify-center text-black text-sm font-semibold px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
          <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-2">
          DOWNLOAD
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling adjustments */
</style>
