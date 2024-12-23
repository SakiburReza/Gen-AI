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
            class="text-black-2 text-2xl focus:outline-none"
            @click="scrollLeft"
          >
            &lt;
          </button>
          <button
            class="text-black-2 text-2xl focus:outline-none"
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
    const videos = ref([
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 1", description: "sample 1" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 2", description: "sample 2" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 3", description: "sample 3" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 4", description: "sample 4" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 5", description: "sample 5" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 7", description: "sample 7" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 8", description: "sample 8" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 9", description: "sample 9" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 10", description: "sample 10" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 11", description: "sample 11" },
    ]);

    const activeIndex = ref(0);
    const carousel = ref(null);

    const visibleVideos = computed(() => {
      const start = activeIndex.value * 2;
      return videos.value.slice(start, start + 2);
    });

    const scrollLeft = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: -100,
          behavior: "smooth",
        });
      }
      updateActiveIndex(-1);
    };

    const scrollRight = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: 100,
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

    const videoRefs = ref([]);

    const observeVideos = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              video.muted = true; // Ensure videos are muted for autoplay to work
              video
                .play()
                .catch((err) => console.warn("Autoplay failed:", err.message));
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the video is visible
      );

      // Observe all video elements
      videoRefs.value.forEach((video) => {
        if (video) observer.observe(video);
      });
    };

    onMounted(() => {
      nextTick(() => {
        // Ensure all video elements are attached to the DOM before observing
        videoRefs.value = Array.from(document.querySelectorAll("video"));
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

