<script setup>
import { FwbCard } from 'flowbite-vue'
import { defineEmits, ref } from 'vue'

// Define emitted events
const emit = defineEmits(['selectRatio', 'selectOutput'])

// Default selections
const selectedRatio = ref('portrait_16_9')

// Handle button click instantly
const handleSelection = (ratio) => {
  selectedRatio.value = ratio
  emit('selectRatio', ratio)
}
</script>

<template>
  <fwb-card class="max-w-sm mx-auto sm:max-w-md md:max-w-lg">
    <div class="p-5">
      <span>
        <img src="/images/icon/showView.svg" alt="Show View Button" />
      </span>
      <!-- Image Ratio -->
      <p class="mt-3 text-xs sm:text-sm text-ravenBlack font-bold">Aspect Ratio</p>

      <div class="mt-3 flex flex-wrap gap-2">
        <!-- Portrait Button -->
        <button
          @click="handleSelection('portrait_16_9')"
          :class="[
            'py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200',
            selectedRatio === 'portrait_16_9'
              ? 'bg-tertiary text-black-2 border-tertiary'
              : 'bg-white text-black-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400',
          ]"
        >
          <img
            src="/images/icon/portrait.svg"
            alt="Portrait Button"
            class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
          />
          <span class="text-xs sm:text-sm">Portrait</span>
        </button>

        <!-- Landscape Button -->
        <button
          @click="handleSelection('landscape_16_9')"
          :class="[
            'py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200',
            selectedRatio === 'landscape_16_9'
              ? 'bg-tertiary text-black-2 border-tertiary'
              : 'bg-white text-black-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400',
          ]"
        >
          <img
            src="/images/icon/landscape.svg"
            alt="Landscape Button"
            class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
          />
          <span class="text-xs sm:text-sm">Landscape</span>
        </button>
      </div>
    </div>
  </fwb-card>
</template>
