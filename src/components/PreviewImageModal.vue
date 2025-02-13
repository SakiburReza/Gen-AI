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

const imgUrl = ref(null) // URL for the image
const isPortrait = ref(false) // Flag to track orientation

const getFilename = (url: string): string =>
  `${url.split('/').pop() || 'download'}${props.image?.type === 'image' ? '.png' : '.mp4'}`;


// Fetch file when image.url is available
const fetchFile = async () => {
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
      loading.value = false;
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
  if (isOpen && imageUrl) {
    loading.value = true;
    fetchFile();
  }
});

watch(fileUrl, () => {
  checkOrientation();
});
// Close handler
const close = () => {
  emit('close');
  prompt.value = "";
  fileUrl.value = null;
  loading.value = false;
};

const checkOrientation = () => {
  const img = new Image();
  img.src = imgUrl.value;
  img.onload = () => {
    isPortrait.value = img.height > img.width;
  };
}

// Handle click outside to close
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
};
</script>

<template>
  <div class="fixed inset-0 flex justify-center items-center" v-if="loading">
    <div class="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click="handleOutsideClick"
    v-if="isOpen && !loading">
    <div class="bg-white rounded-lg shadow-lg w-120 max-w-5xl p-6 relative flex flex-col items-center"
      style="max-height: 90vh; overflow-y: auto;" @click.stop>
      <!-- Close Button -->
      <button @click="close"
        class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md">
        ✕
      </button>

      <!-- Content Wrapper -->
      <div class="flex flex-col w-full">
        <!-- Image or Video Section -->
        <div class="lg:min-w-180 md:min-w-120 sm:min-w-50 flex flex-col items-start">
          <!-- Image Display -->
          <div v-if="image?.type === 'image'" class="w-full flex justify-center items-center">
            <img v-if="fileUrl" :src="fileUrl" alt="Generated Image"
              class="rounded-lg w-full max-w-[80vw] max-h-[calc(80vh-12rem)] object-contain" />
          </div>


          <!-- Video Display -->
          <div v-else-if="image?.type === 'video'" class="w-full">
            <video v-if="fileUrl" :src="fileUrl" controls autoplay 
              class="rounded-lg w-full max-h-[calc(80vh-12rem)] object-contain"></video>
          </div>

          <!-- Prompt Section -->
          <div style="float: left; text-align: left;" class="w-full">
            <!-- <p class="mt-1 text-lg font-bold text-black flex items-start justify-start uppercase tracking-wider" style="padding: 10px;">
              Prompt of the Image
            </p>
            <p v-if="image?.prompt" class="text-sm font-bold text-darkGray bg-tertiary rounded-lg tracking-normal" style="padding: 10px;">
              {{ image.prompt }}
            </p> -->
            <p v-if="image?.prompt" class=" mt-5 text-gray-700 font-bold text-md mb-1 uppercase tracking-wide"> Prompt
              of the Image</p>
            <textarea v-if="image?.prompt"
              class="w-full p-2 rounded-lg text-sm readonly mb-2 font-bold text-darkGray bg-tertiary align-top resize-none"
              style="line-height: 1.5; overflow: auto;" placeholder="Your prompt will appear here"
              readonly>{{ image.prompt }}</textarea>
          </div>
        </div>
        <!-- Download Button -->
        <a v-if="image?.url" :href="fileUrl" :download="getFilename(image.url)"
          class="flex items-center justify-center text-blue-600 text-sm font-bold py-2 px-4 rounded hover:bg-blue-600 hover:text-white mt-4">
          <img src="/images/icon/downloadButton.svg" alt="Download Icon" class="w-4 h-4 mr-2" />
          DOWNLOAD
        </a>
      </div>
    </div>

  </div>
</template>



<style scoped>
/* Optional styling adjustments */
</style>
