<script setup>
import { FwbCard } from 'flowbite-vue'
import { ref } from 'vue'
import { FwbInput } from 'flowbite-vue'
import { FwbButton } from 'flowbite-vue'

const name = ref('')
</script>

<template>
  <fwb-card href="#" class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl">
    <div class="p-5">
      <!-- Title -->
      <h6 class="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
        Customization
      </h6>
      
      <!-- Ratio Input -->
      <fwb-input v-model="name" placeholder="Widescreen (16:9)" label="Ratio" class="w-full" />
      
      <!-- Number of Outputs -->
      <p class="mt-3 text-lg sm:text-xl">Number of Outputs</p>
      
      <!-- Buttons -->
      <div class="flex flex-wrap gap-2 mt-3">
        <fwb-button class="w-16 sm:w-20 bg-gray-400">1</fwb-button>
        <fwb-button class="w-16 sm:w-20 bg-gray-400">2</fwb-button>
        <fwb-button class="w-16 sm:w-20 bg-gray-400">3</fwb-button>
        <fwb-button class="w-16 sm:w-20 bg-gray-400">4</fwb-button>
      </div>
    </div>
  </fwb-card>
</template>

