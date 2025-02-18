<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="flex flex-col bg-white border-r w-20 space-y-4 p-2">
      <button
        v-for="(item, index) in sidebarItems"
        :key="index"
        @click="item.action"
        class="flex flex-col items-center p-2 hover:bg-blue-200 rounded-md"
        :class="{ 'bg-blue-300': selectedTool === item.label }"
      >
        <img :src="item.icon" :alt="item.label" class="w-6 h-6 mb-1" />
        <span class="text-xs text-gray-700">{{ item.label }}</span>
      </button>
    </div>

    <!-- Main Content (Canvas) -->
    <div class="flex flex-grow justify-center items-center bg-gray-100 relative">
      <v-stage ref="stage" :config="stageConfig">
        <v-layer>
          <!-- Images -->
          <v-image v-for="(image, index) in images" :key="index" :config="image" draggable />
          <!-- Shapes -->
          <v-rect v-for="(shape, index) in shapes" :key="index" :config="shape" draggable />
          <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" draggable />
          <!-- Text -->
          <v-text v-for="(text, index) in texts" :key="index" :config="text" draggable />
          <v-transformer ref="transformer" />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import Konva from "konva";

export default {
  data() {
    return {
      selectedTool: null,
      stageConfig: { width: 800, height: 600 },
      images: [],
      shapes: [],
      circles: [],
      texts: [],
      sidebarItems: [
        { label: "Templates", icon: "/images/icon/templates.svg", action: this.addTemplate },
        { label: "Text", icon: "/images/icon/copyIcon.svg", action: this.addText },
        { label: "Photos", icon: "/images/icon/image-to-image.svg", action: this.addImage },
        { label: "Elements", icon: "/images/icon/explore.svg", action: this.addShape },
        { label: "Upload", icon: "/images/icon/upload.svg", action: this.uploadImage },
        { label: "Background", icon: "/images/icon/square.svg", action: this.changeBackground },
        { label: "Layers", icon: "/images/icon/dataIcon.svg", action: this.manageLayers },
        { label: "Resize", icon: "/images/icon/resize.svg", action: this.resizeCanvas }
      ]
    };
  },
  methods: {
    selectTool(label) {
      this.selectedTool = label;
    },
    addTemplate() { console.log("Add template clicked"); },
    addText() {
      this.texts.push({ x: 100, y: 100, text: "New Text", fontSize: 24, draggable: true });
    },
    addImage() {
      Konva.Image.fromURL("https://via.placeholder.com/150", (image) => {
        image.setAttrs({ x: 50, y: 50, draggable: true });
        this.images.push(image);
      });
    },
    addShape() {
      this.shapes.push({ x: 150, y: 150, width: 100, height: 100, fill: "blue", draggable: true });
    },
    uploadImage() { console.log("Upload image clicked"); },
    changeBackground() { console.log("Change background clicked"); },
    manageLayers() { console.log("Manage layers clicked"); },
    resizeCanvas() { console.log("Resize canvas clicked"); }
  }
};
</script>

<style>
/* Sidebar hover effect */
button:hover {
  background-color: rgba(0, 0, 255, 0.1);
}
</style>
