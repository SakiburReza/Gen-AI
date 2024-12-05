<script setup>
import { FwbCard } from 'flowbite-vue'
import { ref ,  defineEmits} from 'vue'
import { FwbTextarea  } from 'flowbite-vue'
// Reactive reference to store the selected image's URL
const imageUrl = ref(null);

// Function to handle image selection
const handleImageUpload = (event) => {
  const file = event.target.files[0]; // Get the first selected file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result; // Set the image URL to the file's data URL
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};
const emit = defineEmits(['input'])
const localDescription = ref('')

const handleInput = () => {
  emit('input', localDescription.value) // Emit the updated value
}

</script>

<template>
  <fwb-card href="#" class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
    <div class="p-5">
      <!-- Title -->
      <h6 class="mb-2 text-xl font-bold tracking-tight text-black dark:text-white sm:text-2xl">
        Describe
      </h6>
      
      <!-- Textarea -->
      <fwb-textarea
        class="w-full h-32 sm:h-40"
        :rows="4"
        v-model="localDescription"
        placeholder="Describe an image you want to create"
        @input="handleInput"
      />
      
      <div class="flex flex-col items-center space-y-4 mt-4 sm:mt-6">
        <!-- File Input -->
        <!-- <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
         -->
        <!-- Preview Section -->
        <div 
          v-if="imageUrl" 
          class="w-full max-w-xs sm:max-w-sm h-64 sm:h-72 border rounded-lg overflow-hidden"
        >
          <img :src="imageUrl" alt="Selected Image" class="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  </fwb-card>
</template>

