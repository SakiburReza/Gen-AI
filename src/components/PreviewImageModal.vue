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
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    @click="handleOutsideClick"
    v-if="isOpen"
  >
    <div
      class="bg-tertiary rounded-lg shadow-lg w-120 max-w-5xl p-6 relative flex flex-col items-center"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md"
      >
        ✕
      </button>

      <!-- Content Wrapper -->
      <div class="flex flex-col gap-6 w-full">
        <!-- Image or Video Section -->
        <div class="w-full flex flex-col items-center">
          <!-- Image Display -->
          <div v-if="image?.type === 'image'" class="w-full">
            <img
              :src="image.url"
              alt="Generated Image"
              class="rounded-lg w-full max-h-[calc(100vh-12rem)] object-contain"
            />
          </div>

          <!-- Video Display -->
          <div v-else-if="image?.type === 'video'" class="w-full">
            <video
              :src="image.url"
              controls
              class="rounded-lg w-full max-h-[calc(100vh-12rem)] object-contain"
            ></video>
          </div>

          <!-- Download Button -->
          <a
            v-if="image?.url"
            :href="image.url"
            :download="getFilename(image.url)"
            class="flex items-center justify-center text-blue-600 text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 hover:text-white mt-4"
          >
            <img
              src="/public/images/icon/downloadButton.svg"
              alt="Download Icon"
              class="w-4 h-4 mr-2"
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
