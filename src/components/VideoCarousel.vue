<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { ref, defineEmits, onMounted } from 'vue';
import { base64ToBlobUrl } from '@/utils/utils'; 
import genAiService from '@/services/gen-ai'

// Videos array
const videos = ref([]); // Store fetched videos here

// Current selected video
const currentVideo = ref(null); // Holds the selected video's attributes

// Emit event to notify parent of video selection
const emit = defineEmits(['video-selected']);
const selectVideo = (video) => {
  currentVideo.value = video; // Update the selected video
  console.log('Selected Video:', video);
    // Emit an object containing only id and prompt
    emit('video-selected', { id: video.id, prompt: video.prompt });
};

// Fetch videos from API and construct video blob URLs
const fetchVideos = async () => {
  try {
    const response = await genAiService.fetchTemplateVideo(); // Replace with your API endpoint
    const content = response.data.data.content; // Access the video content

    // Construct video URLs and update the videos array
    videos.value = content.map((item) => ({
      id: item.id,
      video: base64ToBlobUrl(item.video), // Convert base64 to blob URL
      prompt: item.prompt,
    }));

    if (videos.value.length > 0) {
      currentVideo.value = videos.value[0]; // Set the first video as default
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

// Call fetchVideos when the component is mounted
onMounted(fetchVideos);
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
      :class="{ 'border-4 border-blue-500': currentVideo && currentVideo.id === video.id }"
      @click="selectVideo(video)"
    >
      <video
        controls
        class="w-full rounded-lg shadow-lg cursor-pointer"
        :src="video.video"
      ></video>
      <!-- <p class="text-center mt-2">{{ video.prompt }}</p> -->
    </SplideSlide>
  </Splide>
</template>
