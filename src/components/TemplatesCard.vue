<template>
  <div class="w-full max-w-screen-lg mx-auto p-4 bg-white">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Templates</h2>
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
          v-for="(video, index) in videos"
          :key="index"
          class="flex-shrink-0 w-full sm:w-[45%] md:w-[30%] relative"
          @click="playVideo(index)"
        >
        <!-- Video Section -->
        <video
          ref="videoRef"
          :src="video.src"
          controls
          class="w-full h-[300px] object-contain rounded-lg shadow-md"
          :muted="activeIndex !== index"
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
            v-for="(video, index) in videos"
            :key="index"
            class="w-1 h-1 rounded-full transition-transform duration-300"
            :class="{
              'bg-black-2 scale-150 font-bold': index === activeIndex,
              'bg-black-2': index !== activeIndex,
            }"
          ></span>
      </div>

      <!-- Navigation Buttons (Right) -->
      <div class="flex space-x-4 ml-6">
        <button
          class="text-black text-2xl focus:outline-none"
          @click="scrollLeft"
        >
          &lt;
        </button>
        <button
          class="text-black text-2xl focus:outline-none"
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
import { nextTick, onMounted, ref } from 'vue'

export default {
  setup() {
    // Define the video list and active index
    const videos = ref([
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 1", description: "sample 1" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 2", description: "sample 2" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 3", description: "sample 3" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 4", description: "sample 4" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 5", description: "sample 5" },
      { src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Big 6", description: "sample 6" },
    ]);
    const activeIndex = ref(0);
    const carousel = ref(null);

    // Function to play the video on click
    const playVideo = (index) => {
      const videoElement = carousel.value.children[index].querySelector("video");
      if (videoElement) {
        videoElement.play();
        updateActiveIndex(index); // Update active index when clicked on the video
      }
    };

    // Scroll left action
    const scrollLeft = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: -200,
          behavior: "smooth",
        });
      }
      updateActiveIndex(activeIndex.value - 1); // Play previous video automatically
    };

    // Scroll right action
    const scrollRight = () => {
      if (carousel.value) {
        carousel.value.scrollBy({
          left: 200,
          behavior: "smooth",
        });
      }
      updateActiveIndex(activeIndex.value + 1); // Play next video automatically
    };

    // Update the active index and auto-play video
    const updateActiveIndex = (newIndex) => {
      if (newIndex >= 0 && newIndex < videos.value.length) {
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
              video.muted = false;  // Unmute when video is in view
              video.play()
                .catch((err) => console.warn("Autoplay failed:", err.message));
            } else {
              video.pause();
              video.muted = true;  // Mute video when not in view
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

    // Ensure that the active index is updated when a video is played
    const onPlay = (index) => {
      updateActiveIndex(index);
    };

    return {
      videos,
      activeIndex,
      carousel,
      scrollLeft,
      scrollRight,
      updateActiveIndex,
      playVideo,
      onPlay
    };
  },
};
</script>
