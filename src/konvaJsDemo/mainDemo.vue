<template>
  <div class="relative w-screen h-screen bg-gray-100 flex flex-col items-center justify-start pt-4 space-y-2">
    <div class="left-4 top-4 flex">
      <button @click="toggleImage"
        class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
        {{ isImageVisible ? 'Hide Image' : 'Show Image' }}
      </button>
      <button @click="toggleText"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
        {{ isTextVisible ? 'Hide Text' : 'Show Text' }}
      </button>
      <button @click="toggleShape"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition">
        {{ isShapeVisible ? 'Hide Shape' : 'Show Shape' }}
      </button>
    </div>

    <div class="relative w-full h-full">
      <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown">
        <v-layer ref="layer">
          <!-- Updated v-text elements (add name property) -->
          <v-text v-if="isTextVisible" @dragstart="handleDragStart" @dragend="handleDragEnd"
            @dblclick="enableEditing('outside', $event)" :config="{
              name: 'editableText',  // Add this
              text: textValue,
              x: textPosition.x,
              y: textPosition.y,
              draggable: true,
              fill: isDragging ? 'green' : 'black',
              fontSize: 24,
              fontFamily: 'Arial',
            }" />

          <v-text v-if="isImageVisible" @dragstart="handleDragStart" @dragend="handleDragEnd"
            @dblclick="enableEditing('inside', $event)" :config="{
              name: 'editableImageText',  // Add this
              text: imageText,
              x: imagePosition.x + 50,
              y: imagePosition.y + 50,
              draggable: true,
              fill: '',
              fontSize: 22,
              fontFamily: 'Arial',
            }" />



          <v-image v-if="isImageVisible" ref="image" :config="{
            image: image,
            x: imagePosition.x,
            y: imagePosition.y,
            width: imageSize.width,
            height: imageSize.height,
            draggable: true,
            name: 'editableImage'
          }" />

          <v-text v-if="isImageVisible" @dragstart="handleDragStart" @dragend="handleDragEnd"
            @dblclick="enableEditing('inside', $event)" :config="{
              text: imageText,
              x: imagePosition.x + 50,
              y: imagePosition.y + 50,
              draggable: true,
              fill: 'red',
              fontSize: 20,
              fontFamily: 'Arial',
            }" />

          <v-rect v-if="isShapeVisible" :config="{
            x: shapePosition.x,
            y: shapePosition.y,
            width: shapeSize.width,
            height: shapeSize.height,
            fill: 'blue',
            draggable: true,
            name: 'editableShape'
          }" ref="shape" />

          <v-transformer ref="transformer" />
        </v-layer>
      </v-stage>

      <input v-if="isEditing" ref="inputRef" v-model="editableText" @blur="disableEditing"
        @keydown.enter="disableEditing"
        class="absolute z-50 border border-gray-400 bg-white shadow-md px-2 py-1 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :style="inputStyle" />
    </div>
  </div>
</template>

<script>
import Konva from 'konva';

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  data() {
    return {
      stageSize: { width, height },
      isDragging: false,
      textValue: 'Drag & Edit Me',
      textPosition: { x: 50, y: 50 },
      isEditing: false,
      editingTarget: 'outside',
      isTextVisible: false,
      isImageVisible: false,
      isShapeVisible: false,
      image: null,
      imagePosition: { x: 150, y: 150 },
      imageSize: { width: 200, height: 200 },
      imageText: 'Edit here',
      shapePosition: { x: 300, y: 300 },
      shapeSize: { width: 100, height: 100 },
      inputStyle: {},
      selectedShapeName: ''
    };
  },
  created() {
    const img = new window.Image();
    img.src = "/images/hill.png";
    img.onload = () => {
      this.image = img;
    };
  },
  computed: {
    editableText: {
      get() {
        return this.editingTarget === 'outside' ? this.textValue : this.imageText;
      },
      set(value) {
        if (this.editingTarget === 'outside') {
          this.textValue = value;
        } else {
          this.imageText = value;
        }
      }
    }
  },
  methods: {
    toggleText() {
      this.isTextVisible = !this.isTextVisible;
    },
    toggleImage() {
      this.isImageVisible = !this.isImageVisible;
      this.updateTransformer();
    },
    toggleShape() {
      this.isShapeVisible = !this.isShapeVisible;
      this.updateTransformer();
    },
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd(e) {
      this.isDragging = false;
    },
    enableEditing(target, e) {
      this.isEditing = true;
      this.editingTarget = target;
      this.inputStyle = {
        top: `${e.target.getClientRect().y}px`,
        left: `${e.target.getClientRect().x}px`,
        width: `${e.target.getClientRect().width + 10}px`,
        position: 'absolute'
      };
      this.$nextTick(() => this.$refs.inputRef.focus());
    },
    disableEditing() {
      this.isEditing = false;
    },


    methods: {
      handleStageMouseDown(e) {
        console.log("Stage clicked!sdfasdfsd", e);
        if (e.target === e.target.getStage()) {
          this.selectedShapeName = '';
          this.updateTransformer();
          return;
        }

        const name = e.target.name();
        const editableElements = [
          'editableImage',
          'editableShape',
          'editableText',
          'editableImageText'
        ];

        if (editableElements.includes(name)) {
          this.selectedShapeName = name;
        } else {
          this.selectedShapeName = '';
        }
        this.updateTransformer();
      },
    },

    updateTransformer() {
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const selectedNode = stage.findOne('.' + this.selectedShapeName);

      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
      } else {
        transformerNode.nodes([]);
      }
      stage.batchDraw();
    }
  }
};
</script>
