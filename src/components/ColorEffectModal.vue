<script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: Boolean,
    title: String,
    prompt: String,
  });
  
  const emit = defineEmits(["close", "select"]);
  
  const closeModal = () => {
    emit("close");
  };
  
  const selectOption = () => {
    emit("select");
    emit("close");
  };
  </script>

<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-96 p-5 relative">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-lg font-semibold flex items-center gap-1"> <img src="/images/icon/brush.svg" alt=""> {{ props.title }}</span>
          </div>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </div>
  
        <!-- Body -->
        <div class="mt-3">
          <p class="text-sm font-bold">Prompt</p>
          <p class="text-gray-600 text-sm mt-1">
            {{ props.prompt }}
          </p>
        </div>
  
        <!-- Footer -->
        <button 
          class="mt-5 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-all"
          @click="selectOption"
        >
          Select
        </button>
      </div>
    </div>
  </template>
  
  
  