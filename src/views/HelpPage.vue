<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SidebarForHelpComponent from '@/components/SidebarForHelpComponent.vue'
import HelpCardComponent from '@/components/HelpCardComponent.vue';

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

</script>

<template>
    <div class="float-right">
        <!-- Sidebar Component: Show on mobile if isSidebarOpen is true -->
        <div v-show="isSidebarOpen" @click="handleOutsideClick"
            class="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 float-right">
            <div class="relative w-64 h-full bg-white p-4 float-right" @click.stop>
                <SidebarForHelpComponent />
            </div>
        </div>
        <!-- Button to toggle sidebar visibility -->
        <div @click="toggleSidebar" class="sm:fixed sm:top-10 sm:right-5 w-15 sm:p-6 flex-shrink h-screen bg-tertiary shadow-lg 
            flex flex-col space-y-4  transition-all duration-200 rounded-xl pt-5">
            <img class="h-10 w-15" src="/images/icon/zeuxis.svg" alt="Zeuxis" /> <br>

            <!-- Example icon 1: hamburger menu -->
            <div class="flex justify-center items-start h-screen">
                <div class="flex flex-col space-y-9">
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/explore.svg" alt="Explore" />
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/create.svg" alt="Create" />
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/image-to-video.svg" alt="Image to Video" />
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/text-to-video.svg" alt="Text to Video" />
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/face-swap.svg" alt="Face Swap" />
                    <img class="h-6 w-6 hover:bg-blue-500 transition-all duration-200 rounded"
                        src="/images/icon/templates.svg" alt="Templates" />
                </div>
            </div>
        </div>
        <!-- Sidebar for larger screens (desktop/tablet) -->
        <div class="hidden sm:block">
            <SidebarForHelpComponent />
        </div>
    </div>

    <div class="flex-1 min-h-screen overflow-y-auto p-6 ml-16 sm:ml-64">
        <HelpCardComponent :data="helpData" />
    </div>
</template>



<style></style>