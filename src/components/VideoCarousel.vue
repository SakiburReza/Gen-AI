<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { ref, defineEmits } from 'vue';

// Videos array
const videos = [
  { id: 1, src: '/public/videos/1.mp4', alt: 'Video 1' },
  { id: 2, src: '/public/videos/2.mp4', alt: 'Video 2' },
  { id: 3, src: '/public/videos/3.mp4', alt: 'Video 3' },
];

// Current selected video id
const currentId = ref(1); // Default to the first video's id

// Emit event to notify parent of video selection
const emit = defineEmits(['video-selected']);
const selectVideo = (id) => {
  currentId.value = id; // Update the selected video id
  console.log('Selected Video ID:', id);
  emit('video-selected', currentId.value); // Emit the video id instead of index
};
</script>

<template>
  <Splide
    :options="{
      type: 'loop',
      perPage: 1,
      focus: 'center',
      gap: '1rem',
      padding: '5rem',
      breakpoints: {
        640: {
          perPage: 1,
          padding: '1rem',
        },
        1024: {
          perPage: 3,
          padding: '2rem',
        },
      },
    }"
    class="rounded-lg"
  >
    <SplideSlide
      v-for="(video) in videos"
      :key="video.id"
      :class="{ 'border-4 border-blue-500': video.id === currentId }"
      @click="selectVideo(video.id)"
    >
      <video
        controls
        class="w-full rounded-lg shadow-lg cursor-pointer"
        :src="video.src"
      ></video>
      <p class="text-center mt-2">{{ video.alt }}</p>
    </SplideSlide>
  </Splide>
</template>
