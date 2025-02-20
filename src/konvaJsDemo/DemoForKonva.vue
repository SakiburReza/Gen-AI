<script setup>
import { add } from 'date-fns';
import { reactive, ref, watch } from 'vue';
const stageSize = reactive({
    width: window.innerWidth * 0.4,
    height: window.innerHeight * 0.6,
    backgroundColor: 'lightblue',
});

const shapes = ref([]);
const images = ref([]);
const circles = ref([]);
const ovals = ref([]);

const selectedShapeName = ref('');
const selectedImageName = ref('');
const selectedCircleName = ref('');
const selectedOvalName = ref('');

const transformer = ref(null);
const transformerForImage = ref(null);
const transformerForCircle = ref(null);
const transformerForOval = ref(null);


const textNodes = ref([]);
const textValue = ref('Edit Text');

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
const handleTransformEndForOval = (o) => {
    console.log("oooo", o);
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

const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
        selectedShapeName.value = '';
        selectedImageName.value = '';
        selectedCircleName.value = '';
        selectedOvalName.value = '';
        updateTransformer();
        updateTransformerForImage();
        updateTransformerForCircle();
        updateTransformerForOval();
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
    } else if (images.value.some((img) => img.name === name)) {
        selectedImageName.value = name;
        selectedShapeName.value = '';
        selectedCircleName.value = '';
    } else if (circles.value.some((c) => c.name === name)) {
        selectedCircleName.value = name;
        selectedImageName.value = '';
        selectedShapeName.value = '';
    } else if (ovals.value.some((o) => o.name === name)) {
        selectedOvalName.value = name;
        selectedCircleName.value = '';
        selectedImageName.value = '';
        selectedShapeName.value = '';
    }
    else {
        selectedShapeName.value = '';
        selectedImageName.value = '';
        selectedCircleName.value = '';
        selectedOvalName.value = '';
    }

    updateTransformer();
    updateTransformerForImage();
    updateTransformerForCircle();
    updateTransformerForOval();
};

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

watch(selectedShapeName, updateTransformer);
watch(selectedImageName, updateTransformerForImage);
watch(selectedCircleName, updateTransformerForCircle);
watch(selectedCircleName, updateTransformerForCircle);
watch(selectedOvalName, updateTransformerForOval);

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
const addOval = () => {
    // console.log("Oval Clicked");
    ovals.value.push({
        x: 100,
        y: 100,
        radiusX: 70,
        radiusY: 50,
        fill: 'Orange',
        draggable: true,
        name: `circle-${ovals.value.length}`,
    });
};

const loadImages = (event) => {
    const imgSrc = event.dataTransfer.getData("imageUrl");
    if (!imgSrc) return;

    console.log("Image Clicked");
    const imgObj = new Image();
    imgObj.src = imgSrc;
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
        images.value = [...images.value];
    };
};

const addTextNode = () => {
    textNodes.value.push({
        text: textValue.value,
        x: 100,
        y: 100,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green',
        draggable: true,
        name: `text-${textNodes.value.length}`,
    });
};

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
            <button class="flex items-center space-x-2" @click="addTemplate">
                <img src="/images/icon/templates.svg" alt="Templates" class="w-5 h-5">
                <span>Templates</span>
            </button>

            <input v-model="textValue" class="border p-2 rounded-md shadow-sm" placeholder="Enter text" />

            <button class="flex items-center space-x-2" @click="addTextNode">
                <img src="/images/icon/copyIcon.svg" alt="Text" class="w-5 h-5">
                <span>Text</span>
            </button>

            <button class="flex items-center space-x-2" @click="loadImages">
                <img src="/images/icon/image-to-image.svg" alt="Photos" class="w-5 h-5">
                <span>Photos</span>
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

            <button class="flex items-center space-x-2" @click="uploadFile">
                <img src="/images/icon/upload.svg" alt="Upload" class="w-5 h-5">
                <span>Upload</span>
            </button>

            <button class="flex items-center space-x-2" @click="changeBackground">
                <img src="/images/icon/square.svg" alt="Background" class="w-5 h-5">
                <span>Background</span>
            </button>

            <button class="flex items-center space-x-2" @click="manageLayers">
                <img src="/images/icon/dataIcon.svg" alt="Layers" class="w-5 h-5">
                <span>Layers</span>
            </button>

            <button class="flex items-center space-x-2" @click="resizeCanvas">
                <img src="/images/icon/resize.svg" alt="Resize" class="w-5 h-5">
                <span>Resize</span>
            </button>
        </div>

        <!-- Canvas Container -->
        <div class="flex flex-1 items-center justify-center p-6 w-screen" @drop="loadImages" @dragover.prevent>
            <div class="relative bg-white shadow-md rounded-sm border-gray-600"
                :style="{ width: stageSize.width + 'px', height: stageSize.height + 'px' }">
                <!-- Canvas Background -->
                <div class="absolute inset-0 bg-white border-gray-300 rounded-lg"></div>

                <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown">
                    <v-layer ref="layer">
                        <!-- Rectangles -->
                        <v-rect v-for="item in shapes" :key="item.id" :config="item"
                            @transformend="handleTransformEnd" />
                        <!-- Circles -->
                        <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" draggable
                            @transformend="handleTransformEndForCircle" />
                        <!-- Oval -->
                        <v-ellipse v-for="(oval, index) in ovals" :key="index" :config="oval" draggable
                            @transformend="handleTransformEndForOval" />
                        <!-- Text Nodes -->
                        <v-text v-for="(text, index) in textNodes" :key="index" :config="text" draggable />
                        <!-- Images -->
                        <v-image v-for="(image, index) in images" :key="index"
                            :config="{ ...image, image: image.image }" draggable
                            @transformend="handleTransformEndForImage" />
                        <!-- Transformer -->
                        <v-transformer ref="transformer" />
                        <v-transformer ref="transformerForImage" />
                        <v-transformer ref="transformerForCircle" />
                        <v-transformer ref="transformerForOval" />
                    </v-layer>
                </v-stage>
            </div>
        </div>
    </div>
</template>
