<script setup>
import { FwbCard } from 'flowbite-vue'
import { ref, defineEmits, watch } from 'vue'
import { FwbTextarea } from 'flowbite-vue'

const emit = defineEmits(['input'])
const localDescription = ref('')

const handleInput = () => {
  emit('input', localDescription.value) // Emit the updated value
}

const props = defineProps({
  resetKey: {
    type: Number,
    default: 0,
  }
});

watch(
  () => props.resetKey,
  () => {
    localDescription.value = '';
  }
);
</script>

<template>
  <!-- <fwb-card class="max-w-md mx-auto sm:max-w-lg md:max-w-2xl"> -->

  <!-- Title -->
  <!-- <h6 class="mb-2 text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white sm:text-md">
        Describe
      </h6> -->
  <!-- Textarea -->
  <!-- <fwb-textarea class="w-full h-16 sm:h-40 sm:w-120 text-dimGray text-sm justify-start" :rows="2" label=""
    v-model.lazy="localDescription" placeholder="Add image or describe your image in detail
 or learn" @input="handleInput" style="font-family: 'Inter', sans-serif;" /> -->
  <fwb-textarea class="w-full h-16 sm:h-40 sm:w-120 text-dimGray text-sm justify-start bg-lotion" :rows="2" label=""
    v-model.lazy="localDescription" placeholder="Add image or describe your image in detail or 𝗹𝗲𝗮𝗿𝗻"
    @input="handleInput" style="font-family: 'Inter', sans-serif;" />

  <!-- </fwb-card> -->
</template>
