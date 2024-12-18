<template>
    <div class="flex ">
      <!-- Video Button -->
      <button
        @click="setActive('video')"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition',
          activeButton === 'video'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-500'
        ]"
      >
        <span class="material-icons">videocam</span>
      </button>
  
      <!-- Image Button -->
      <button
        @click="setActive('image')"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition',
          activeButton === 'image'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-500'
        ]"
      >
        <span class="material-icons">image</span>
      </button>
    </div>
  </template>
  
  <script setup>
  // Composition API
  import { ref } from "vue";
  
  const activeButton = ref("video");
  
  function setActive(button) {
    activeButton.value = button;
  }
  </script>
  
  <style>
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
  </style>