<template>
  <div class="w-full max-w-screen-lg mx-auto p-4 bg-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Video Carousel</h2>
      <span>{{ videos.length }} total</span>
    </div>

    <!-- Carousel and Pagination with Buttons -->
    <div class="relative bg-gray-100 p-4 rounded-lg">
      <!-- Video List -->
      <div
        ref="carousel"
        class="flex overflow-x-auto space-x-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
        @scroll="handleScroll"
        style="max-width: 100%;"
      >
        <div
          v-for="(video, index) in visibleVideos"
          :key="index"
          class="flex-shrink-0 w-full sm:w-[45%] md:w-[45%] relative"
        >
          <!-- Video Section -->
          <video
            ref="videoRef"
            :src="video.src"
            controls
            class="w-full h-[300px] object-contain rounded-lg shadow-md"
          ></video>

          <!-- Overlay for Title and Description -->
          <div
            class="absolute top-0 left-0 w-full h-full flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white p-4 rounded-lg"
          >
            <h3 class="text-lg font-bold">{{ video.title }}</h3>
            <p class="text-sm">{{ video.description }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination Indicators and Navigation Buttons -->
      <div class="flex items-center justify-between mt-4 bg-gray-100 p-0 rounded-lg">
        <!-- Pagination Dots (Center) -->
        <div class="flex space-x-2 justify-center flex-grow">
          <span
            v-for="(video, index) in visibleVideos"
            :key="index"
            class="w-3 h-3 rounded-full transition-transform duration-100"
            :class="{
              'bg-black-2 scale-150 font-bold': index === activeIndex,
              'bg-black-2': index !== activeIndex,
            }"
          ></span>
        </div>

        <!-- Navigation Buttons (Right) -->
        <div class="flex space-x-4 ml-6">
          <button
            class="text-black-2 text-4xl focus:outline-none"
            @click="scrollLeft"
          >
            &lt;
          </button>
          <button
            class="text-black-2 text-4xl focus:outline-none"
            @click="scrollRight"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';

export default {
  setup() {
    // Define the video list and active index
    const videos = ref([
      { src: "video1.mp4", title: "Video 1", description: "Description 1" },
      { src: "video2.mp4", title: "Video 2", description: "Description 2" },
      { src: "video3.mp4", title: "Video 3", description: "Description 3" },
      { src: "video4.mp4", title: "Video 4", description: "Description 4" },
      { src: "video5.mp4", title: "Video 5", description: "Description 5" },
      { src: "video5.mp4", title: "Video 6", description: "Description 6" },
      { src: "video5.mp4", title: "Video 7", description: "Description 7" },
    ]);
    const activeIndex = ref(0);
    const carousel = ref(null);

    // Computed property to determine the visible videos (2 at a time)
    const visibleVideos = computed(() => {
      const start = activeIndex.value * 2;
      return videos.value.slice(start, start + 2);
    });

    // Scroll functions
    const scrollLeft = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: -200,
          behavior: "smooth",
        });
      }
      updateActiveIndex(-1);
    };

    const scrollRight = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: 200,
          behavior: "smooth",
        });
      }
      updateActiveIndex(1);
    };

    const updateActiveIndex = (direction) => {
      const newIndex = activeIndex.value + direction;
      if (newIndex >= 0 && newIndex * 2 < videos.value.length) {
        activeIndex.value = newIndex;
      }
    };

    // Intersection Observer to detect when video comes into view
    const videoRefs = ref([]);
    const observeVideos = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            video.play(); // Play video when it comes into view
          } else {
            const video = entry.target;
            video.pause(); // Pause video when it goes out of view
          }
        });
      }, { threshold: 0.5 }); // Trigger when 50% of the video is visible

      // Observe all video elements
      videoRefs.value.forEach((video) => observer.observe(video));
    };

    onMounted(() => {
      nextTick(() => {
        observeVideos();
      });
    });

    return {
      videos,
      activeIndex,
      carousel,
      scrollLeft,
      scrollRight,
      updateActiveIndex,
      visibleVideos,
      videoRefs,
    };
  },
};
</script>

