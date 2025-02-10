<template>
  <div class="relative w-screen h-screen bg-gray-100 flex flex-col items-center justify-start pt-4 space-y-2">
    <!-- Control Buttons -->
    <button @click="toggleImage"
      class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
      {{ isImageVisible ? 'Hide Image' : 'Show Image' }}
    </button>

    <button @click="toggleText"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
      {{ isTextVisible ? 'Hide Text' : 'Show Text' }}
    </button>

    <!-- Konva Stage -->
    <div class="relative w-full h-full">
      <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown">
        <v-layer ref="layer">
          <!-- Draggable Text Outside Image -->
          <v-text v-if="isTextVisible" @dragstart="handleDragStart" @dragend="handleDragEnd"
            @dblclick="enableEditing('outside', $event)" :config="{
              text: textValue,
              x: textPosition.x,
              y: textPosition.y,
              draggable: true,
              fill: isDragging ? 'green' : 'black',
              fontSize: 24,
              fontFamily: 'Arial',
            }" />

          <!-- Draggable & Resizable Image -->
          <v-image v-if="isImageVisible" ref="image" :config="{
            image: image,
            x: imagePosition.x,
            y: imagePosition.y,
            width: imageSize.width,
            height: imageSize.height,
            draggable: true,
            name: 'editableImage'
          }" />

          <!-- Draggable Text Inside Image -->
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

          <!-- Transformer for Image -->
          <v-transformer ref="transformer" />
        </v-layer>
      </v-stage>

      <!-- Editable Input (Appears when double-clicking the text) -->
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
      image: null,
      imagePosition: { x: 150, y: 150 },
      imageSize: { width: 200, height: 200 },
      imageText: 'Edit Me!',
      inputStyle: {},
      selectedShapeName: ''
    };
  },
  created() {
    const img = new window.Image();
    img.src = "https://konvajs.org/assets/yoda.jpg";
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
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd(e) {
      this.isDragging = false;
      if (e.target.text() === this.textValue) {
        this.textPosition.x = e.target.x();
        this.textPosition.y = e.target.y();
      } else {
        this.imagePosition.x = e.target.x();
        this.imagePosition.y = e.target.y();
      }
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
    handleStageMouseDown(e) {
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      const clickedOnTransformer = e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      const name = e.target.name();
      if (name === 'editableImage') {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
      } else {
        transformerNode.nodes([]);
      }
    }
  }
};
</script>
