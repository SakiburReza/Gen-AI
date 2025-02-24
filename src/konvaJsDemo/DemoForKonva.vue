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
// const handleKeyDown = (event) => {
//   if (event.key === 'Delete') {
//     if (selectedImageName.value) {
//       images.value = images.value.filter(img => img.name !== selectedImageName.value);
//       selectedImageName.value = '';
//     } else if (selectedTextName.value) {
//       textNodes.value = textNodes.value.filter(text => text.name !== selectedTextName.value);
//       selectedTextName.value = '';
//     }
//   }
// };

const handleKeyDown = (event) => {
  if (event.key === 'Delete') {
    if (selectedImageName.value) {
      images.value = images.value.filter(img => img.name !== selectedImageName.value);
      selectedImageName.value = '';
    } else if (selectedTextName.value) {
      textNodes.value = textNodes.value.filter(text => text.name !== selectedTextName.value);
      selectedTextName.value = '';
    } else if (selectedShapeName.value) {
      shapes.value = shapes.value.filter(shape => shape.name !== selectedShapeName.value);
      selectedShapeName.value = '';
    } else if (selectedCircleName.value) {
      circles.value = circles.value.filter(circle => circle.name !== selectedCircleName.value);
      selectedCircleName.value = '';
    } else if (selectedOvalName.value) {
      ovals.value = ovals.value.filter(oval => oval.name !== selectedOvalName.value);
      selectedOvalName.value = '';
    }
  }
};

const deleteSelectedItem = () => {
  if (selectedImageName.value) {
    images.value = images.value.filter(img => img.name !== selectedImageName.value);
    selectedImageName.value = '';
  } else if (selectedTextName.value) {
    textNodes.value = textNodes.value.filter(text => text.name !== selectedTextName.value);
    selectedTextName.value = '';
  } else if (selectedShapeName.value) {
    shapes.value = shapes.value.filter(shape => shape.name !== selectedShapeName.value);
    selectedShapeName.value = '';
  } else if (selectedCircleName.value) {
    circles.value = circles.value.filter(circle => circle.name !== selectedCircleName.value);
    selectedCircleName.value = '';
  } else if (selectedOvalName.value) {
    ovals.value = ovals.value.filter(oval => oval.name !== selectedOvalName.value);
    selectedOvalName.value = '';
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
    const offset = images.value.length * 30;
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
  textNodes.value.push({
    text: 'Edit Text',
    x: 100,
    y: 100,
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green',
    draggable: true,
    name: `text-${textNodes.value.length}`,
  });
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
const deleteImage = (index) => {
  images.value.splice(index, 1);
} 
</script>

<template>

  <!-- topbar for another editin stuff -->
  <div class="bg-tertiary border-gray-300 w-full text-black h-12 pl-1 flex items-center">
    <button class="bg-black hover:bg-blue-600 p-2 rounded-lg" @click="deleteSelectedItem(index)">
      <img src="/images/icon/delete-icon.svg" alt="Delete" height="20px" width="20px">
    </button>
  </div>
  <div class="flex h-screen bg-gray-100 p-5">

    <!-- Left Sidebar -->
    <div class="flex flex-col space-y-5 font-bold bg-white p-6 w-64 rounded-lg shadow-md max-h-screen">
      <button class="flex items-center space-x-2" @click="addTextNode">
        <img src="/images/icon/copyIcon.svg" alt="Text" class="w-5 h-5">
        <span>Text</span>
      </button>

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
    </div>

    <!-- Canvas Container -->

    <div class="flex justify-center p-6 w-screen" @drop="loadImages" @dragover.prevent>

      <div class="relative bg-white shadow-md rounded-sm border-gray-600"
        :style="{ width: stageSize.width + 'px', height: stageSize.height + 'px' }">

        <!-- Canvas Background -->
        <div class=" bg-white border-gray-300 rounded-lg"></div>

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
              @transformend="handleTransformEndForText" @dblclick="(e) => e.target.setAttr('editable', true)" />

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
      </div>
    </div>


  </div>
</template>
