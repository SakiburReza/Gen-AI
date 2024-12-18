<script setup>
import { FwbCard, FwbButton } from 'flowbite-vue'
</script>

<template>
  <fwb-card>
    <!-- Photo Details -->
    <div class="p-5">
      <h5 class="mb-4 text-lg font-bold text-gray-800 dark:text-white">Photo Details</h5>
      
      <!-- Prompt Section -->
      <div class="mb-4">
        <p class="font-semibold text-gray-700 dark:text-gray-300">
          Prompt:
          <span class="font-normal text-gray-600 dark:text-gray-400">
            A bottom up image if a girl walking confident down the city streets
          </span>
        </p>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 mb-4">
        <fwb-button class="bg-blue-600 hover:bg-blue-700 text-white">
          Turn into Video
        </fwb-button>
        <fwb-button color="gray" class="bg-blue-600 hover:bg-blue-700 text-white">
          Image Reference
        </fwb-button>
      </div>

      <!-- Download Section -->
      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-6 0l-4-4m0 0l-4 4m4-4v12"></path>
        </svg>
        <span class="font-medium">DOWNLOAD</span>
      </div>
    </div>
  </fwb-card>
</template>