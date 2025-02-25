<script setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';

const stageSize = reactive({
  width: window.innerWidth * 0.4,
  height: window.innerHeight * 0.6,
  backgroundColor: 'lightblue',
});

const shapes = ref([]);
const dashed = ref([]);
const dotteds = ref([]);
const images = ref([]);
const circles = ref([]);
const ovals = ref([]);
const textNodes = ref([]);

const selectedShapeName = ref('');
const selectedImageName = ref('');
const selectedCircleName = ref('');
const selectedOvalName = ref('');
const selectedTextName = ref('');
const selectedDashedLine = ref('');
const selectedDottedLine = ref('');

const transformer = ref(null);
const transformerForImage = ref(null);
const transformerForCircle = ref(null);
const transformerForOval = ref(null);
const transformerForText = ref(null);
const transformerForDashedLine = ref(null);
const transformerForDottedLine = ref(null);
const colorPicker = ref(false);
const selectedColor = ref('green');

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
// Handle transform end for DashedLine
const handleTransformEndForDashedLine = (d) => {
  const dashIndex = dashed.value.findIndex(
    (dash) => dash.name === selectedDashedLine.value
  );

  if (dashIndex !== -1) {
    dashed.value[dashIndex] = {
      ...dashed.value[dashIndex],
      x: d.target.x(),
      y: d.target.y(),
      rotation: d.target.rotation(),
      scaleX: d.target.scaleX(),
      scaleY: d.target.scaleY(),
    };
  }
};
// Handle transform end for DashedLine
const handleTransformEndForDottedLine = (dt) => {
  const dottedIndex = dotted.value.findIndex(
    (dotted) => dotted.name === selectedDottedLine.value
  );

  if (dottedIndex !== -1) {
    dotteds.value[dottedIndex] = {
      ...dotteds.value[dottedIndex],
      x: dt.target.x(),
      y: dt.target.y(),
      rotation: dt.target.rotation(),
      scaleX: dt.target.scaleX(),
      scaleY: dt.target.scaleY(),
    };
  }
};

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
    } else if (selectedDashedLine.value) {
      dashed.value = dashed.value.filter(dash => dash.name !== selectedDashedLine.value);

    }
    else if (selectedDottedLine.value) {
      dotteds.value = dotteds.value.filter(dotted => dotted.name !== selectedDottedLine.value);

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
  } else if (selectedDashedLine.value) {
    dashed.value = dashed.value.filter(dash => dash.name !== selectedDashedLine.value);
    selectedDashedLine.value = '';
  }
  else if (selectedDottedLine.value) {
    dotteds.value = dotteds.value.filter(dotted => dotted.name !== selectedDottedLine.value);
    selectedDottedLine.value = '';
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
    selectedDashedLine.value = '';
    selectedDottedLine.value = '';
    updateTransformer();
    updateTransformerForImage();
    updateTransformerForCircle();
    updateTransformerForOval();
    updateTransformerForText();
    updateTransformerForDashedLine();
    updateTransformerForDottedLine();
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
    startTextEditing(e.target);
  } else if (dashed.value.some((d) => d.name === name)) {
    selectedDashedLine.value = name;
    selectedTextName.value = '';
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
  } else if (dotteds.value.some((dt) => dt.name === name)) {
    selectedDottedLine.value = name;
    selectedDashedLine.value = '';
    selectedTextName.value = '';
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
  }
  else {
    selectedShapeName.value = '';
    selectedImageName.value = '';
    selectedCircleName.value = '';
    selectedOvalName.value = '';
    selectedTextName.value = '';
    selectedDashedLine.value = '';
    selectedDottedLine.value = '';
  }

  updateTransformer();
  updateTransformerForImage();
  updateTransformerForCircle();
  updateTransformerForOval();
  updateTransformerForText();
  updateTransformerForDashedLine();
  updateTransformerForDottedLine();
};



// Watch for changes in selected color
watch(selectedColor, (newColor) => {
  if (selectedTextName.value) {
    const textIndex = textNodes.value.findIndex(
      (text) => text.name === selectedTextName.value
    );

    if (textIndex !== -1) {
      textNodes.value[textIndex] = {
        ...textNodes.value[textIndex],
        fill: newColor,
      };
    }
  }
  if (selectedShapeName.value) {
    const shapeIndex = shapes.value.findIndex(
      (shape) => shape.name === selectedShapeName.value
    );

    if (shapeIndex !== -1) {
      shapes.value[shapeIndex] = {
        ...shapes.value[shapeIndex],
        fill: newColor,
      };
    }
  }
  if (selectedCircleName.value) {
    const circleIndex = circles.value.findIndex(
      (circle) => circle.name === selectedCircleName.value
    );

    if (circleIndex !== -1) {
      circles.value[circleIndex] = {
        ...circles.value[circleIndex],
        fill: newColor,
      };
    }
  }
  if (selectedOvalName.value) {
    const ovalIndex = ovals.value.findIndex(
      (oval) => oval.name === selectedOvalName.value
    );

    if (ovalIndex !== -1) {
      ovals.value[ovalIndex] = {
        ...ovals.value[ovalIndex],
        fill: newColor,
      };
    }
  }
  if (selectedDashedLine.value) {
    const dashIndex = dashed.value.findIndex(
      (dash) => dash.name === selectedDashedLine.value
    );

    if (dashIndex !== -1) {
      dashed.value[dashIndex] = {
        ...dashed.value[dashIndex],
        stroke: newColor,
      };
    }
  }
  if (selectedDottedLine.value) {
    const dottedIndex = dotteds.value.findIndex(
      (dotted) => dotted.name === selectedDottedLine.value
    );

    if (dottedIndex !== -1) {
      dotteds.value[dottedIndex] = {
        ...dotteds.value[dottedIndex],
        stroke: newColor,
      };
    }
  }

});


// Start text editing
const startTextEditing = (textNode) => {
  colorPicker.value = true;
  // Set the text node to be editable
  textNode.setAttr('editable', true);

  // Create a temporary input element
  const input = document.createElement('input');
  input.type = 'text';
  input.value = textNode.text();
  input.style.position = 'absolute';
  input.style.top = `${textNode.absolutePosition().y}px`;
  input.style.left = `${textNode.absolutePosition().x}px`;
  input.style.fontSize = `${textNode.fontSize()}px`;
  input.style.fontFamily = textNode.fontFamily();
  input.style.color = textNode.fill();
  input.style.transform = `rotate(${textNode.rotation()}deg)`;
  input.style.outline = 'none';
  // input.style.border = '0.5px solid #000'; // Optional: Add a border for better visibility

  // Append the input to the stage container
  const stage = textNode.getStage();
  stage.container().appendChild(input);
  input.focus();

  // Handle input blur (save changes)
  input.addEventListener('blur', () => {
    textNode.text(input.value); // Update the text node
    stage.container().removeChild(input); // Remove the input element
    textNode.setAttr('editable', false); // Disable editing mode
  });

  // Handle Enter key to save changes
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      textNode.text(input.value); // Update the text node
      stage.container().removeChild(input); // Remove the input element
      textNode.setAttr('editable', false); // Disable editing mode
    }
  });
};

// Update transformer for shapes
const updateTransformer = () => {
  colorPicker.value = true;
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

// Update transformer for DashedLine
const updateTransformerForDashedLine = () => {
  if (!transformerForDashedLine.value) return;

  const transformerNode = transformerForDashedLine.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedDashedLine.value}`);

  if (selectedNode) {
    transformerNode.nodes([selectedNode]);
  } else {
    transformerNode.nodes([]);
  }
};

// Update transformer for DashedLine
const updateTransformerForDottedLine = () => {
  if (!transformerForDottedLine.value) return;

  const transformerNode = transformerForDottedLine.value.getNode();
  const stage = transformerNode.getStage();
  const selectedNode = stage.findOne(`.${selectedDottedLine.value}`);

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
watch(selectedDashedLine, updateTransformerForDashedLine);
watch(selectedDottedLine, updateTransformerForDottedLine);

// Add a circle
const addCircle = () => {
  circles.value.push({
    x: 100,
    y: 100,
    radius: 50,
    fill: selectedColor.value,
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
    fill: selectedColor.value,
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
const handleTextColorChange = (e) => {
  colorPicker.value = false;
};

// Add a text node
const addTextNode = () => {
  textNodes.value.push({
    text: 'Edit Text',
    x: 100,
    y: 100,
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: selectedColor.value,
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
    fill: selectedColor.value,
    name: `rect-${shapes.value.length}`,
    draggable: true,
  });
};
const dashedLine = () => {
  dashed.value.push({
    points: [50, 100, 300, 100],
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    draggable: true,
    stroke: selectedColor.value,
    name: `dash-${dashed.value.length}`,
  });
};
const dottedLine = () => {
  dotteds.value.push({
    points: [50, 100, 300, 100],
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    draggable: true,
    stroke: selectedColor.value,
    name: `dotted-${dotteds.value.length}`,
    dash: [2, 10]
  });
};
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
      <button class="flex items-center space-x-2" @click="dashedLine">
        <img src="/images/icon/explore.svg" alt="Add Dashed Line" class="w-5 h-5">
        <span>Dashed Line</span>
      </button>
      <button class="flex items-center space-x-2" @click="dottedLine">
        <img src="/images/icon/explore.svg" alt="Add Dotted Line" class="w-5 h-5">
        <span>Dotted Line</span>
      </button>

      <input type="file" @change="uploadFile" class="hidden" id="fileInput" />
      <label for="fileInput" class="flex items-center space-x-2 cursor-pointer">
        <img src="/images/icon/upload.svg" alt="Upload" class="w-5 h-5">
        <span>Upload Image</span>
      </label>
      <span v-if="colorPicker" class="flex"> Color: <input type="color" v-model="selectedColor"
          @input="handleTextColorChange" /></span>
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
              @transformend="handleTransformEndForText" @dblclick="(e) => startTextEditing(e.target)" />
            <!-- Dashed Line -->
            <v-line v-for="(dashed, index) in dashed" :key="index" :config="dashed" draggable
              @transformend="handleTransformEndForDashedLine" />
            <!-- Dotted Line -->
            <v-line v-for="(dotted, index) in dotteds" :key="index" :config="dotted" draggable
              @transformend="handleTransformEndForDottedLine" />
            <!-- Images -->
            <v-image v-for="(image, index) in images" :key="index" :config="{ ...image, image: image.image }" draggable
              @transformend="handleTransformEndForImage(event, index)" />
            <!-- Transformer -->
            <v-transformer ref="transformer" />
            <v-transformer ref="transformerForImage" />
            <v-transformer ref="transformerForCircle" />
            <v-transformer ref="transformerForOval" />
            <v-transformer ref="transformerForText" />
            <v-transformer ref="transformerForDashedLine" />
            <v-transformer ref="transformerForDottedLine" />
          </v-layer>
        </v-stage>
      </div>
    </div>


  </div>
</template>
