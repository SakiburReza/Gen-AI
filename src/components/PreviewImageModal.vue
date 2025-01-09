<script setup lang="ts">
import { ref, watch } from 'vue';
import { imageUrl } from '@/utils/utils';

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
});

// Emits
const emit = defineEmits(['close']);

// State
const prompt = ref<string | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const fileUrl = ref<string | null>(null);

const getFilename = (url: string): string =>
  `${url.split('/').pop() || 'download'}${props.image?.type === 'image' ? '.png' : '.mp4'}`;


// Fetch file when image.url is available
const fetchFile = async () => {
  console.log('fetchFile called');
  if (props.image?.url) {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(imageUrl() + props.image.url);
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }
      const fileBlob = await response.blob();
      fileUrl.value = URL.createObjectURL(fileBlob);
      console.log('File URL:', fileUrl.value);
    } catch (err) {
      error.value = `Failed to fetch the file: ${err.message}`;
      console.error('Error fetching file:', err);
    } finally {
      loading.value = false;
    }
  }
};

// Watch for changes in image.url and isOpen to fetch the file when image.url is set
watch([() => props.image?.url, () => props.isOpen], ([imageUrl, isOpen]) => {
  console.log('Watching image.url and isOpen:', imageUrl, isOpen);
  if (isOpen && imageUrl) {
    fetchFile();
  }
});
// Close handler
const close = () => {
  emit('close');
  prompt.value = "";
};

// Handle click outside to close
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click="handleOutsideClick"
    v-if="isOpen">
    <div class="bg-white rounded-lg shadow-lg w-120 max-w-5xl p-6 relative flex flex-col items-center"
      style="max-height: 90vh; overflow-y: auto;" @click.stop>
      <!-- Close Button -->
      <button @click="close"
        class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md">
        ✕
      </button>

      <!-- Content Wrapper -->
      <div class="flex flex-col gap-6 w-full">
        <!-- Image or Video Section -->
        <div class="w-full flex flex-col items-start">
          <!-- Image Display -->
          <div v-if="image?.type === 'image'" class="w-full">
            <img v-if="fileUrl" :src="fileUrl" alt="Generated Image"
              class="rounded-lg w-full max-h-[calc(80vh-12rem)] object-contain" />
          </div>

          <!-- Video Display -->
          <div v-else-if="image?.type === 'video'" class="w-full">
            <video v-if="fileUrl" :src="fileUrl" controls
              class="rounded-lg w-full max-h-[calc(80vh-12rem)] object-contain"></video>
          </div>

          <!-- Prompt Section -->
          <div style="float: left; text-align: left;" class="w-full">
            <p class="mt-5 text-xl font-bold text-black flex items-start justify-start" style="padding: 10px;">
              Prompt of the Image &nbsp;
            </p>
            <p v-if="image?.prompt" class="mt-5 text-xl font-bold text-darkGray bg-tertiary" style="padding: 10px;">
              {{ image.prompt }}
            </p>
          </div>
        </div>

        <!-- Download Button -->
        <a v-if="image?.url" :href="fileUrl" :download="getFilename(image.url)"
          class="flex items-center justify-center text-blue-600 text-sm font-bold py-2 px-4 rounded hover:bg-blue-600 hover:text-white mt-4">
          <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-4 h-4 mr-2" />
          DOWNLOAD
        </a>
      </div>
    </div>

  </div>
</template>



<style scoped>
/* Optional styling adjustments */
</style>
