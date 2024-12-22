<script setup>
import { FwbCard } from 'flowbite-vue'
import { ref, defineEmits } from 'vue'
import { FwbTextarea } from 'flowbite-vue'

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
        class="w-full h-16 sm:h-20"
        :rows="2"
        v-model.lazy="localDescription"
        placeholder="Describe an image you want to create"
        @input="handleInput"
      />
    </div>
  </fwb-card>
</template>
