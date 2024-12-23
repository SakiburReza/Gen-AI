<script setup lang="ts">
import { ref } from 'vue';

// Props
defineProps({
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
const emit = defineEmits(['close'])

// Methods
// function handleOutsideClick(event) {
//       if (this.$refs.modal && !this.$refs.modal.contains(event.target)) {
//         // Close modal if the click is outside the modal
//         close();
//       }
//     }
// Helper to extract filename from URL
const getFilename = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'download';
};

// API call to convert the image to a video
const turnIntoVideoAction = async () => {
  if (!image || !image.url) {
    alert('No image selected.');
    return;
  }
  if (!prompt.value) {
    alert('Please enter a prompt.');
    return;
  }

  isLoading.value = true; // Show loading state
  try {
    const formData = new FormData();
    formData.append('image', image.url); // Correctly use `image.url`
    formData.append('prompt', prompt.value);

    // Replace `genAiService.imageToVideo` with your actual API service
    const response = await genAiService.imageToVideo(formData);

    if (response && response.success) {
      alert('Video generated successfully!');
      // Handle the response, e.g., display the video or download it
    } else {
      console.error(response);
      alert('Failed to generate video. Please try again.');
    }
  } catch (error) {
    console.error('API Error:', error);
    alert('An error occurred while processing your request.');
  } finally {
    isLoading.value = false; // Hide loading state
  }
};

// Close the modal
const close = () => {
  emit('close');
};


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
      </div>

      <!-- Details Section (Right) -->
      <div class="md:w-1/2 bg-white rounded-lg p-6 flex flex-col justify-between">
        <!-- Title -->
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Photo Details</h3>

        <!-- Prompt -->
        <div class="mb-6">
          <p class="text-gray-600 font-bold text-sm mb-1">Prompt:</p>
          <input
            v-model="prompt"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-600"
            placeholder="Enter your prompt here"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <button
            @click="turnIntoVideoAction"
            :disabled="isLoading"
            class="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {{ isLoading ? 'Processing...' : 'Turn into Video' }}
          </button>
          <button
            class="bg-gray-200 text-sm text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
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
