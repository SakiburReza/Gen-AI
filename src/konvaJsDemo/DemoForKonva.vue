<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';

const stageSize = reactive({
  width: window.innerWidth * 0.4,
  height: window.innerHeight * 0.6,
  backgroundColor: 'lightblue',
});

const shapes = ref([]);
const images = ref([]);
const circles = ref([]);
const ovals = ref([]);
const textNodes = ref([]);

const selectedShapeName = ref('');
const selectedImageName = ref('');
const selectedCircleName = ref('');
const selectedOvalName = ref('');
const selectedTextName = ref('');

// Text editing state
const isEditingText = ref(false);
const isAddingText = ref(false); // Track if adding new text
const textValue = ref('Edit Text');
const editingTextPosition = reactive({ x: 0, y: 0 }); // Position of the text being edited

const transformer = ref(null);
const transformerForImage = ref(null);
const transformerForCircle = ref(null);
const transformerForOval = ref(null);
const transformerForText = ref(null);

// Handle transform end for shapes
const handleTransformEnd = (e) => {
  const rectIndex = shapes.value.findIndex(
    (r) => r.name === selectedShapeName.value
  );

  if (rectIndex !== -1) {
    shapes.value[rectIndex] = {
      ...shapes.value[rectIndex],
      x: e.target.x(),
      y: e.target.y(),
      rotation: e.target.rotation(),
      scaleX: e.target.scaleX(),
      scaleY: e.target.scaleY(),
    };
  }
};

// Handle transform end for circles
const handleTransformEndForCircle = (c) => {
  const circleIndex = circles.value.findIndex(
    (circle) => circle.name === selectedCircleName.value
  );

  if (circleIndex !== -1) {
    circles.value[circleIndex] = {
      ...circles.value[circleIndex],
      x: c.target.x(),
      y: c.target.y(),
      rotation: c.target.rotation(),
      scaleX: c.target.scaleX(),
      scaleY: c.target.scaleY(),
    };
  }
};

// Handle transform end for ovals
const handleTransformEndForOval = (o) => {
  const ovalIndex = ovals.value.findIndex(
    (oval) => oval.name === selectedOvalName.value
  );

  if (ovalIndex !== -1) {
    ovals.value[ovalIndex] = {
      ...ovals.value[ovalIndex],
      x: o.target.x(),
      y: o.target.y(),
      rotationX: o.target.rotation(),
      rotationY: o.target.rotation(),
      scaleX: o.target.scaleX(),
      scaleY: o.target.scaleY(),
    };
  }
};

// Handle transform end for images
const handleTransformEndForImage = (i) => {
  const imgIndex = images.value.findIndex(
    (img) => img.name === selectedImageName.value
  );

  if (imgIndex !== -1) {
    images.value[imgIndex] = {
      ...images.value[imgIndex],
      x: i.target.x(),
      y: i.target.y(),
      rotation: i.target.rotation(),
      scaleX: i.target.scaleX(),
      scaleY: i.target.scaleY(),
    };
  }
};

// Handle transform end for text
const handleTransformEndForText = (t) => {
  const textIndex = textNodes.value.findIndex(
    (tex) => tex.name === selectedTextName.value
  );

  if (textIndex !== -1) {
    textNodes.value[textIndex] = {
      ...textNodes.value[textIndex],
      x: t.target.x(),
      y: t.target.y(),
      rotation: t.target.rotation(),
      scaleX: t.target.scaleX(),
      scaleY: t.target.scaleY(),
    };
  }
};

// Handle keydown events (e.g., delete key)
const handleKeyDown = (event) => {
  if (event.key === 'Delete') {
    if (selectedImageName.value) {
      images.value = images.value.filter(img => img.name !== selectedImageName.value);
      selectedImageName.value = '';
    } else if (selectedTextName.value) {
      textNodes.value = textNodes.value.filter(text => text.name !== selectedTextName.value);
      selectedTextName.value = '';
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Handle stage mouse down events
const handleStageMouseDown = (e) => {
  if (e.target === e.target.getStage()) {
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
    isEditingText.value = false;
    isAddingText.value = false;
    updateTransformer();
    updateTransformerForImage();
    updateTransformerForCircle();
    updateTransformerForOval();
    updateTransformerForText();
    return;
  }

  if (e.target.getParent()?.className === 'Transformer') {
    return;
  }

  const name = e.target.name();
  if (shapes.value.some((r) => r.name === name)) {
    selectedShapeName.value = name;
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
  } else if (images.value.some((img) => img.name === name)) {
    selectedImageName.value = name;
    selectedShapeName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
  } else if (circles.value.some((c) => c.name === name)) {
    selectedCircleName.value = name;
    selectedImageName.value = '';
    selectedShapeName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
  } else if (ovals.value.some((o) => o.name === name)) {
    selectedOvalName.value = name;
    selectedCircleName.value = '';
    selectedImageName.value = '';
    selectedShapeName.value = '';
    selectedTextName.value = '';
  } else if (textNodes.value.some((t) => t.name === name)) {
    selectedTextName.value = name;
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    isEditingText.value = true;
    textValue.value = e.target.text();
    editingTextPosition.x = e.target.x();
    editingTextPosition.y = e.target.y();
  } else {
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
  }

  updateTransformer();
  updateTransformerForImage();
  updateTransformerForCircle();
  updateTransformerForOval();
  updateTransformerForText();
};

// Update transformer for shapes
const updateTransformer = () => {
  if (!transformer.value) return;

  const transformerNode = transformer.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedShapeName.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Update transformer for images
const updateTransformerForImage = () => {
  if (!transformerForImage.value) return;

  const transformerNode = transformerForImage.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedImageName.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Update transformer for circles
const updateTransformerForCircle = () => {
  if (!transformerForCircle.value) return;

  const transformerNode = transformerForCircle.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedCircleName.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Update transformer for ovals
const updateTransformerForOval = () => {
  if (!transformerForOval.value) return;

  const transformerNode = transformerForOval.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedOvalName.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Update transformer for text
const updateTransformerForText = () => {
  if (!transformerForText.value) return;

  const transformerNode = transformerForText.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedTextName.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Watch for changes in selected items and update transformers
watch(selectedShapeName, updateTransformer);
watch(selectedImageName, updateTransformerForImage);
watch(selectedCircleName, updateTransformerForCircle);
watch(selectedOvalName, updateTransformerForOval);
watch(selectedTextName, updateTransformerForText);

// Add a circle
const addCircle = () => {
  circles.value.push({
    x: 100,
    y: 100,
    radius: 50,
    fill: 'blue',
    draggable: true,
    name: `circle-${circles.value.length}`,
  });
};

// Add an oval
const addOval = () => {
  ovals.value.push({
    x: 100,
    y: 100,
    radiusX: 70,
    radiusY: 50,
    fill: 'Orange',
    draggable: true,
    name: `oval-${ovals.value.length}`,
  });
};

// Load images from drag-and-drop
const loadImages = (event) => {
  const imgSrc = event.dataTransfer.getData("imageUrl");
  if (!imgSrc) return;

    const imgObj = new window.Image();
    imgObj.src = imgSrc;
    imgObj.onload = () => {
        const offset = images.value.length * 100;
        images.value.push({
            id: `img-${images.value.length}`,
            image: imgObj,
            x: 50 + offset,
            y: 50 + offset,
            width: 200,
            height: 200,
            scaleX: 1,
            scaleY: 1,
            draggable: true,
            name: `image-${images.value.length}`,
        });
        images.value = [...images.value];
    };
};

// Add a text node
const addTextNode = () => {
  isAddingText.value = true;
  textValue.value = 'Edit Text';
};

// Confirm and add the text node
const confirmAddTextNode = () => {
  if (textValue.value.trim()) {
    textNodes.value.push({
      text: textValue.value,
      x: editingTextPosition.x,
      y: editingTextPosition.y,
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green',
      draggable: true,
      name: `text-${textNodes.value.length}`,
    });
    isAddingText.value = false;
  }
};

// Update the selected text node
const updateTextNode = () => {
  const index = textNodes.value.findIndex((t) => t.name === selectedTextName.value);
  if (index !== -1) {
    textNodes.value[index].text = textValue.value;
    isEditingText.value = false;
  }
};

// Function to delete the selected text node
const deleteTextNode = () => {
  textNodes.value = textNodes.value.filter((t) => t.name !== selectedTextName.value);
  isEditingText.value = false;
};


// Upload an image from the device
const uploadFile = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgObj = new Image();
      imgObj.src = e.target.result;
      imgObj.onload = () => {
        images.value.push({
          id: `img-${images.value.length}`,
          image: imgObj,
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          scaleX: 1,
          scaleY: 1,
          draggable: true,
          name: `image-${images.value.length}`,
        });
      };
    };
    reader.readAsDataURL(file);
  }
};

// Add a shape
const addShape = () => {
  shapes.value.push({
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: 'red',
    name: `rect-${shapes.value.length}`,
    draggable: true,
  });
};
</script>

<template>
  <div class="flex h-screen bg-gray-100 p-5">
    <!-- Left Sidebar -->
    <div class="flex flex-col space-y-5 font-bold bg-white p-6 w-64 rounded-lg shadow-md max-h-screen">
      <!--            <button class="flex items-center space-x-2" @click="addTemplate">-->
      <!--                <img src="/images/icon/templates.svg" alt="Templates" class="w-5 h-5">-->
      <!--                <span>Templates</span>-->
      <!--            </button>-->


      <button class="flex items-center space-x-2" @click="addTextNode">
        <img src="/images/icon/copyIcon.svg" alt="Text" class="w-5 h-5">
        <span>Text</span>
      </button>

      <!--            <button class="flex items-center space-x-2" @click="loadImages">-->
      <!--                <img src="/images/icon/image-to-image.svg" alt="Photos" class="w-5 h-5">-->
      <!--                <span>Photos</span>-->
      <!--            </button>-->

      <button class="flex items-center space-x-2" @click="addShape">
        <img src="/images/icon/explore.svg" alt="Add Shape" class="w-5 h-5">
        <span>Add Shape</span>
      </button>

      <button class="flex items-center space-x-2" @click="addCircle">
        <img src="/images/icon/explore.svg" alt="Add Circle" class="w-5 h-5">
        <span>Add Circle</span>
      </button>
      <button class="flex items-center space-x-2" @click="addOval">
        <img src="/images/icon/explore.svg" alt="Add Oval" class="w-5 h-5">
        <span>Add Oval</span>
      </button>

      <input type="file" @change="uploadFile" class="hidden" id="fileInput" />
      <label for="fileInput" class="flex items-center space-x-2 cursor-pointer">
        <img src="/images/icon/upload.svg" alt="Upload" class="w-5 h-5">
        <span>Upload Image</span>
      </label>

      <!--            <button class="flex items-center space-x-2" @click="changeBackground">-->
      <!--                <img src="/images/icon/square.svg" alt="Background" class="w-5 h-5">-->
      <!--                <span>Background</span>-->
      <!--            </button>-->

      <!--            <button class="flex items-center space-x-2" @click="manageLayers">-->
      <!--                <img src="/images/icon/dataIcon.svg" alt="Layers" class="w-5 h-5">-->
      <!--                <span>Layers</span>-->
      <!--            </button>-->

      <!--            <button class="flex items-center space-x-2" @click="resizeCanvas">-->
      <!--                <img src="/images/icon/resize.svg" alt="Resize" class="w-5 h-5">-->
      <!--                <span>Resize</span>-->
      <!--            </button>-->
    </div>

    <!-- Canvas Container -->
    <div class="flex justify-center p-6 w-screen" @drop="loadImages" @dragover.prevent>
      <div class="relative bg-white shadow-md rounded-sm border-gray-600"
        :style="{ width: stageSize.width + 'px', height: stageSize.height + 'px' }">
        <!-- Canvas Background -->
        <div class="absolute inset-0 bg-white border-gray-300 rounded-lg"></div>

        <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown">
          <v-layer ref="layer">
            <!-- Rectangles -->
            <v-rect v-for="item in shapes" :key="item.id" :config="item" @transformend="handleTransformEnd" />
            <!-- Circles -->
            <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" draggable
              @transformend="handleTransformEndForCircle" />
            <!-- Oval -->
            <v-ellipse v-for="(oval, index) in ovals" :key="index" :config="oval" draggable
              @transformend="handleTransformEndForOval" />
            <!-- Text Nodes -->
            <v-text v-for="(text, index) in textNodes" :key="index" :config="text" draggable
              @transformend="handleTransformEndForText" />

            <!-- Images -->
            <v-image v-for="(image, index) in images" :key="index" :config="{ ...image, image: image.image }" draggable
              @transformend="handleTransformEndForImage(event, index)" />
            <!-- Transformer -->
            <v-transformer ref="transformer" />
            <v-transformer ref="transformerForImage" />
            <v-transformer ref="transformerForCircle" />
            <v-transformer ref="transformerForOval" />
            <v-transformer ref="transformerForText" />
          </v-layer>
        </v-stage>

        <!-- Text Input on Canvas -->
        <div v-if="isAddingText" class="absolute bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-2"
          :style="{ left: '100px', top: '100px' }">
          <div class="relative">
            <input v-model="textValue"
              class="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 pr-8 rounded-md w-full"
              placeholder="Enter text" />
            <button v-if="textValue" @click="textValue = ''"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
              ✕
            </button>
          </div>
          <button @click="confirmAddTextNode"
            class="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Add
          </button>
        </div>

        <!-- Text Editor on Canvas -->
        <div v-if="isEditingText" class="absolute bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-4"
          :style="{ left: `${editingTextPosition.x}px`, top: `${editingTextPosition.y}px` }">
          <!-- Close (X) Button in Top Right -->
          <button @click="deleteTextNode"
            class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition">
            ✕
          </button>

          <div class="relative">
            <input v-model="textValue"
              class="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 pr-8 rounded-md w-full"
              placeholder="Enter text" />
            <button v-if="textValue" @click="textValue = ''"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
              ✕
            </button>
          </div>
          <button @click="updateTextNode"
            class="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Update
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
