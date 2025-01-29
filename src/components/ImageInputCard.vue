<script setup>
import { FwbCard } from 'flowbite-vue'
import { ref, defineProps, defineEmits, watch } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Insert Image', // Default title
  },
  resetKey: {
    type: Number,
    default: 0,
  }
})

watch(
  () => props.resetKey,
  () => {
    imageUrl.value = null; // Clear the selected image
  }
);

// Emit event
const emit = defineEmits(['input']) // This will emit the selected file to the parent component

// Reactive reference to store the selected image's URL
const imageUrl = ref(null)

// Function to handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files?.[0] // Get the first file from the input
  if (file) {
    previewImage(file)
    emit('input', file) // Emit the selected file to the parent component
  }
}

// Function to handle drag-and-drop functionality
const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files?.[0] // Get the first file from the drag event
  if (file) {
    previewImage(file)
    emit('input', file) // Emit the selected file to the parent component
  }
}

// Utility function to generate preview
const previewImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result // Set the image URL for preview
  }
  reader.readAsDataURL(file) // Read the file as a data URL
}

// Prevent default behavior for drag-over events
const handleDragOver = (event) => {
  event.preventDefault()
}
</script>

<template>
  <fwb-card href="#" class="max-w-sm mx-auto sm:max-w-md md:max-w-lg">
    <div class="p-4">
      <!-- Title -->
      <!-- <h6 class="mb-2 text-lg font-bold tracking-tight text-black dark:text-white sm:text-xl">
        {{ title }}
      </h6> -->

      <!-- Image Input Block -->
      <div
        class="relative block w-full text-sm border border-gray-300 rounded-lg h-48 sm:h-56 cursor-pointer bg-gray-100 flex items-center justify-center overflow-hidden"
        @dragover="handleDragOver" @drop="handleDrop">
        <!-- File Input -->
        <input type="file" accept="image/*" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          @change="handleImageUpload" />

        <!-- Image Preview -->
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image Preview" class="w-full h-full object-contain" />

        <!-- Placeholder -->
        <div v-else
          class="text-ravenBlack font-bold text-lg flex flex-col items-center justify-center text-center gap-4">
          <!-- Drop Image Icon -->
          <img src="/public/images/icon/dropandimage.svg" alt="Drop an Image icon" class="w-5 sm:w-10">

          <!-- Text -->
          <p class="text-base sm:text-lg">Drop an Image</p>

          <!-- Select Image Button -->
          <button
            class="border border-gray-400 rounded-xl px-6 py-1 text-ravenBlack hover:bg-gray-200 transition-all duration-200">
            Select Image
          </button>
        </div>

      </div>
    </div>
  </fwb-card>
</template>
