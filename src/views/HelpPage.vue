<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SidebarForHelpComponent from '@/components/SidebarForHelpComponent.vue'
import HelpCardComponent from '@/components/HelpCardComponent.vue';
import CommunitySidebar from '@/components/CommunitySidebar.vue'


const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value; // Access the value of isSidebarOpen
}

const helpData = {
  title: 'Assistance Center',
  cards: [
    { title: "Getting started", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "How do I change my account email?", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "In-depth documentations", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "Create with newcomers", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "Video tutorials", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "Prompt crafting", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "Billing support", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "How do I create with text", description: "To change your email, go to account settings, update your email, save changes and verify." },
    { title: "How do I create with image", description: "To change your email, go to account settings, update your email, save changes and verify." },
  ],
};

// Handle click outside to close
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    isSidebarOpen.value = false;
  }
};

const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

</script>

<template>
  <!-- <div class="flex flex-row-reverse h-screen"> -->

  <!-- Sidebar -->
  <!-- <div class="float-right flex"> -->
  <!-- Sidebar Component: Show on mobile if isSidebarOpen is true -->
  <!-- <div v-show="isSidebarOpen" @click="handleOutsideClick" class="sm:hidden fixed inset-0 z-50">
        <div class="relative w-60 h-full  float-right"
          :class="{ 'translate-x-0': isSidebarOpen, 'translate-x-full': !isSidebarOpen }" @click.stop>
          <SidebarForHelpComponent />
        </div>
      </div> -->
  <!-- Button to toggle sidebar visibility -->
  <!-- <div @click="toggleSidebar" v-if="!isSidebarOpen" class="sm:hidden sm:top-10 sm:right-5 md:right-10 w-10
            sm:p-6 flex-shrink shadow-lg bottom-0 bg-tertiary h-full 
            flex flex-col space-y-4 transition-all duration-500 pt-5 
            overflow-y-auto max-h-screen">
        <img class="h-10 w-15" src="/images/icon/zeuxis.svg" alt="Zeuxis" /> <br> -->

  <!-- Icons Section -->
  <!-- <div class="flex justify-center items-start md:h-auto">
          <div class="flex flex-col space-y-9">
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded" src="/images/icon/explore.svg"
              alt="Explore" />
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded" src="/images/icon/create.svg"
              alt="Create" />
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
              src="/images/icon/image-to-video.svg" alt="Image to Video" />
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
              src="/images/icon/text-to-video.svg" alt="Text to Video" />
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded" src="/images/icon/face-swap.svg"
              alt="Face Swap" />
            <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded" src="/images/icon/templates.svg"
              alt="Templates" />
          </div>
        </div>
      </div> -->
  <!-- </div> -->
  <!-- Sidebar for larger screens (desktop & tablet) -->
  <!-- <div class="hidden sm:block lg:w-80 xl:w-96 h-screen shadow-lg"
      :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-0': !isSidebarOpen }">
      <SidebarForHelpComponent />
    </div> -->

  <!-- </div> -->

  <!-- Main Content: Occupies remaining space and stays on the left -->
  <button class="md:hidden float-end" @click="toggleMenu">
      <svg class="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- Main Content -->
    <div class="px-4 max-h-screen w-full ">
      <HelpCardComponent :data="helpData" />
    </div>

    <!-- Sidebar Section -->
    <!-- <div
      class="md:w-64 md:ml-5 mt-5 md:mt-0 fixed md:relative top-12 right-7 w-60 h-full rounded-3xl overflow-hidden z-50 md:block"
      :class="{ 'hidden': !showMenu, 'block': showMenu }">
      <div class="w-80 rounded-3xl overflow-hidden">
        <CommunitySidebar class="w-full" />
      </div>
    </div> -->

</template>




<style></style>