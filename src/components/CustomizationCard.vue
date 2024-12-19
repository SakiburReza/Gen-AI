<script setup>
import { FwbCard } from 'flowbite-vue'
import { FwbButton } from 'flowbite-vue'

import { defineEmits,ref } from 'vue'

// Define emitted events
const emit = defineEmits(['selectRatio', 'selectOutput'])

// Default selections
const selectedRatio = ref('landscape_16_9')
const selectedOutput = ref(1)

// Emit defaults on mount
emit('selectRatio', selectedRatio.value)
emit('selectOutput', selectedOutput.value)


</script>

<template>
  <fwb-card href="#" class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
    <div class="p-5">
      <!-- Title -->
      <h6 class="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
        Customization
      </h6>
      
      <!-- Image Ratio -->
      <p class="mt-3 text-lg sm:text-xl">Select Image Ratio</p>
      
      <!-- Ratio Buttons -->
      <div class="flex flex-col-2 gap-2 mt-3">
        <!-- Landscape Button -->
        <fwb-button
          class="w-1/2"
          :class="selectedRatio === 'landscape_16_9' ? 'bg-blue-600 text-white' : 'bg-gray-400'"
          @click="() => {
            selectedRatio = 'landscape_16_9'
            emit('selectRatio', 'landscape_16_9')
          }"
        >
          Landscape (16:9)
        </fwb-button>
        
        <!-- Portrait Button -->
        <fwb-button
          class="w-1/2"
          :class="selectedRatio === 'portrait_16_9' ? 'bg-blue-600 text-white' : 'bg-gray-400'"
          @click="() => {
            selectedRatio = 'portrait_16_9'
            emit('selectRatio', 'portrait_16_9')
          }"
        >
          Portrait (9:16)
        </fwb-button>
      </div>
      
      <!-- Number of Outputs -->
      <p class="mt-3 text-lg sm:text-xl">Number of Outputs</p>
      
      <!-- Output Buttons -->
      <div class="flex flex-wrap gap-2 mt-3">
        <fwb-button
          v-for="output in [1, 2, 3, 4]"
          :key="output"
          class="w-16 sm:w-20"
          :class="selectedOutput === output ? 'bg-blue-600 text-white' : 'bg-gray-400'"
          @click="() => {
            selectedOutput = output
            emit('selectOutput', output)
          }"
        >
          {{ output }}
        </fwb-button>
      </div>
    </div>
  </fwb-card>
</template>