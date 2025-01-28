<script setup>
import { FwbCard } from 'flowbite-vue'
import { FwbButton } from 'flowbite-vue'

import { defineEmits, ref } from 'vue'

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
  <fwb-card class="max-w-sm mx-auto sm:max-w-md md:max-w-lg">
    <div class="p-5">
      <!-- Title -->
      <!-- <h6 class="mb-2 text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white">
        Customize
      </h6> -->
      <span>
        <img src="/public/images/icon/showView.svg" alt="Show View Button">
      </span>
      <!-- Image Ratio -->
      <p class="mt-3 text-xs sm:text-sm text-ravenBlack font-bold">Aspect Ratio</p>


      <!-- <div class="mt-3">
        Dropdown Select for Ratio
        <select v-model="selectedRatio" @change="() => emit('selectRatio', selectedRatio)"
          class="bg-tertiary text-sm rounded-md p-2 w-full text-dimGray font-bold">
          <option value="landscape_16_9" :selected="selectedRatio === 'landscape_16_9'">
            Landscape (16:9)
          </option>
          <option value="portrait_16_9" :selected="selectedRatio === 'portrait_16_9'">
            Portrait (9:16)
          </option>
        </select>
      </div> -->
      <div class="mt-3 flex flex-wrap gap-2 justify-start">
        <!-- Portrait Button -->
        <div @click="() => emit('selectRatio', 'portrait_16_9')"
          :class="['py-2 px-10 rounded-2xl  font-semibold cursor-pointer bg-white hover:bg-tertiary', selectedRatio === 'portrait_16_9' ? 'text-silver' : 'text-ravenBlack']"
          class="flex items-center border">
          <img src="/public/images/icon/portrait.svg" alt="Portrait Button" class="mr-2">
          Portrait
        </div>
        <!-- Landscape Button -->
        <div @click="() => emit('selectRatio', 'landscape_16_9')"
          :class="['py-1 px-10 rounded-2xl font-semibold cursor-pointer bg-white hover:bg-tertiary', selectedRatio === 'landscape_16_9' ? 'text-silver' : 'text-ravenBlack']"
          class="flex items-center border">
          <img src="/public/images/icon/landscape.svg" alt="Landscape Button" class="rotate-50 mr-2">
          Landscape
        </div>
      </div>




      <!-- Number of Outputs -->
      <!-- <p class="mt-3 text-xs sm:text-sm text-dimGray font-bold">Number of Outputs</p> -->

      <!-- Output Buttons -->
      <!-- <div class="flex flex-wrap gap-2 mt-3">
        <fwb-button v-for="output in [1, 2, 3, 4]" :key="output" class="w-16 sm:w-20"
          :class="selectedOutput === output ? 'bg-blue-600 text-white' : 'bg-gray-400'" @click="() => {
            selectedOutput = output
            emit('selectOutput', output)
          }">
          {{ output }}
        </fwb-button>
      </div> -->
    </div>
  </fwb-card>
</template>