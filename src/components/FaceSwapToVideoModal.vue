<script setup lang="ts">
import { onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
import genAiService from '@/services/gen-ai';
import { useToastStore } from '@/stores/toast'
import { useCredits } from '@/utils/utils'
import { imageUrl } from '@/utils/utils'

const { fetchCredits } = useCredits()

const toastStore = useToastStore()

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  image: {
    type: Object as () => { url: string; type: string; prompt: string } | null,
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

// State
const prompt = ref<string | null>(null);


const isLoading = ref(false);

const promptError = ref<string | null>(null); // Track prompt validation errors

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const fileUrl = ref<string | null>(null);


// Helper to extract filename from URL
const getFilename = (url: string): string =>
  `${url.split('/').pop() || 'download'}${props.image?.type === 'image' ? '.png' : '.mp4'}`;


// // API call to convert the image to a video
// const turnIntoVideoAction = async () => {
//   console.log("Executing turnIntoVideoAction");

//   if (!props.image || !props.image.url) {
//     alert('No image selected.');
//     return;
//   }
//   if (!prompt.value) {
//     alert('Please enter a prompt.');
//     return;
//   }

//   isLoading.value = true; // Show loading state
//   try {
//     const formData = new FormData();

//     const imgResponse = await fetch(props.image.url);
//     const blob = await imgResponse.blob();

//     // Convert the Blob to a File with a filename
//     //const file = new File([blob], getFilename(props.image.url), { type: blob.type });

//     let type = "face-swap"
//     formData.append('image_url', props.image.url); // Correctly use image.url
//     formData.append('prompt', prompt.value);
//     formData.append('type', type)

//     console.log("Sending formData:", { image: props.image.url, prompt: prompt.value });

//     // Assuming genAiService.imageToVideo is an API client that handles requests
//     const response = await genAiService.imageToVideo(formData);

//     console.log("API Response:", response);

//     if (response?.success) {
//       toastStore.success(response.data.message || 'Video generated successfully!');
//       // Update credits after successful content generation
//       await fetchCredits()
//     } else {
//       console.error("Error in API response:", response);
//       toastStore.error(response.data.message || 'Failed to generate video. Please try again.');
//     }
//   } catch (error) {
//     console.error("Error occurred:", error);
//     toastStore.error(error || 'Failed to generate video. Please try again.');
//   } finally {
//     isLoading.value = false; // Hide loading state
//   }
// };



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
      loading.value = false;
      console.log('File URL:', fileUrl.value);
    } catch (err) {
      error.value = `Failed to fetch the file: ${err.message}`;
      console.error('Error fetching file:', err);
    } finally {
      loading.value = false;
    }
  }
};

// API call to convert the image to a video
const turnIntoVideoAction = async () => {
  promptError.value = !prompt.value ? "Prompt is required." : null;

  if (promptError.value || !props.image?.url) return;

  isLoading.value = true;
  try {
    const formData = new FormData();
    const imgResponse = await fetch(props.image.url);
    const blob = await imgResponse.blob();

    let type = "image-to-video";
    formData.append('image_url', props.image.url);
    formData.append('prompt', prompt.value);
    formData.append('type', type);

    const response = await genAiService.imageToVideo(formData);

    if (response?.data?.status) {
      toastStore.success(response?.data.message)
      // Update credits after successful content generation
      await fetchCredits()
      close();
    } else {
      toastStore.error(response.data.message || 'Failed to generate video. Please try again.');
    }
  } catch (error) {
    toastStore.error(error || 'Failed to generate video. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

// Close the modal
const close = () => {
  emit('close');
  prompt.value = "";
  promptError.value = null;
};

// Watcher for prompt validation
watch(prompt, (newVal) => {
  promptError.value = !newVal ? "Prompt is required." : null;
});

watch([() => props.image?.url, () => props.isOpen], ([imageUrl, isOpen]) => {
  if (isOpen && imageUrl) {
    loading.value = true;
    fetchFile();
  }
});

const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
}

</script>
<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click="handleOutsideClick"
    v-if="isOpen">
    <div class="bg-tertiary rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
      <!-- Close Button -->
      <button @click="close"
        class="top-2 right-1 bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md float-end">
        ✕
      </button>
      <br>

      <!-- Two Column Layout -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Image Section -->
        <div class="md:col-span-1 w-full flex items-center">
          <div v-if="image?.type === 'image'" class="w-full h-auto">
            <img :src="imageUrl() + image.url" alt="Generated Image" class="rounded-lg w-full h-auto object-contain" />
          </div>
          <div v-else-if="image?.type === 'video'" class="w-full h-auto">
            <video :src="imageUrl() + image.url" controls class="rounded-lg w-full h-auto object-contain"></video>
          </div>
        </div>
        <!-- Details Section -->
        <div class="md:col-span-2 bg-white shadow-lg rounded-lg p-6 flex items-center" style="height: 100%;">
          <div class="w-full">
            <!-- Title -->
            <!-- <h3 v-if="image?.type === 'image'" class="text-sm font-semibold text-gray-900 mb-6">Photo Details</h3> -->
            <!-- <h3 v-else-if="image?.type === 'video'" class="text-sm font-semibold text-gray-900 mb-6">Video Details</h3> -->

            <!-- Prompt -->
            <div class="mb-7">
              <p v-if="image?.prompt" class="text-gray-700 font-semibold text-sm mb-2 uppercase tracking-wide">Existing
                Prompt</p>
              <!-- <p v-if="image?.prompt"
                class="w-full p-2 border border-silverChalice rounded-lg text-lg mb-10 font-bold text-darkGray bg-tertiary align-top resize-none"
                style="line-height: 1.5; overflow:auto;" placeholder="Your prompt will appear here">{{ image.prompt }}
              </p> -->
              <textarea v-if="image?.prompt"
              class="w-full p-2 rounded-lg text-sm readonly mb-2 font-bold text-darkGray bg-tertiary align-top resize-none"
              style="line-height: 1.5; overflow: auto;" placeholder="Your prompt will appear here"
              readonly>{{ image.prompt }}</textarea>

              <p class="text-gray-700 font-semibold text-sm uppercase tracking-wide mb-1">Enter Prompt for Video</p>

              <input v-model="prompt" type="text"
                class="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your prompt here" />


              <p v-if="promptError" class="text-red text-sm font-bold mt-1">
                {{ promptError }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-start">
              <button @click="turnIntoVideoAction" :disabled="isLoading"
                class="bg-blue-600 text-white text-xs px-16 py-2 rounded-lg hover:bg-blue-600 md:w-auto">
                {{ isLoading ? 'Processing...' : 'Turn into Video' }}
              </button>
              <button
                class="bg-silverChalice text-xs text-black px-16 py-2 rounded-lg hover:bg-silverChalice md:w-auto mt-4 md:mt-0">
                Image Reference
              </button>
            </div>
            <!-- Download Link -->
            <div class="mt-5 text-center">
              <a v-if="image?.url" :href="fileUrl" :download="getFilename(image.url)"
                class="flex items-start justify-start text-black text-xs px-1 font-semibold py-3">
                <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-1.5" />
                DOWNLOAD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>


<style scoped>
/* Optional styling adjustments */
</style>