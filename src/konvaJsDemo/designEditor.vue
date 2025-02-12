<template>
  <div class="flex flex-col h-screen">
    <!-- Toolbar -->
    <div ref="toolbarRef" class="bg-white p-2 border-b shadow-sm"></div>

    <!-- Editor Layout -->
    <div class="flex flex-1">
      <!-- Sidebar (with Image Media Section) -->
      <div class="w-64 bg-gray-100 border-r shadow-sm flex flex-col">
        <div ref="sidebarRef" class="flex-1 overflow-y-auto"></div>

        <!-- Image Media Section -->
        <div class="p-2 border-t bg-white">
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div
              v-for="(item, index) in media"
              :key="index"
              class="relative overflow-hidden group shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              :class="[ item.orientation === 'P' ? 'row-span-2' : 'row-span-1' ]"
            >
              <img
                v-if="item.type === 'image'"
                :src="imageUrl(item.url)"
                :alt="'Media ' + index"
                class="h-full max-w-full w-full object-cover cursor-pointer"
                :class="[ item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]' ]"
                @click="onImageClick(item)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Workspace -->
      <div ref="workspaceRef" class="flex-1 bg-white"></div>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, ref, onMounted, onBeforeUnmount } from "vue";
import { createStore } from "polotno/model/store";
import { Toolbar } from "polotno/toolbar/toolbar";
import { SidePanelWrapper } from "polotno/side-panel/side-panel";
import { Workspace } from "polotno/canvas/workspace";

// Refs for React components
const toolbarRef = shallowRef(null);
const sidebarRef = shallowRef(null);
const workspaceRef = shallowRef(null);

// Create Polotno store
const store = createStore({ key: "YOUR_POLOTNO_KEY" });

onMounted(() => {
  store.addPage();

  // Render React components inside Vue
  Toolbar({ store, container: toolbarRef.value });
  SidePanelWrapper({ store, container: sidebarRef.value });
  Workspace({ store, container: workspaceRef.value });
});

onBeforeUnmount(() => {
  store.destroy();
});

// Media Data (Replace with API Data)
const media = ref([
  { url: "image1.jpg", type: "image", orientation: "P" },
  { url: "image2.jpg", type: "image", orientation: "L" },
]);

// Function to Get Image URL
const imageUrl = (path) => {
  return `/uploads/${path}`; // Adjust the path based on your project structure
};

// Image Click Handler - Adds Image to Polotno Canvas
const onImageClick = (item) => {
  store.activePage.addElement({
    type: "image",
    src: imageUrl(item.url),
    width: 200,
    height: 200,
  });
};
</script>
