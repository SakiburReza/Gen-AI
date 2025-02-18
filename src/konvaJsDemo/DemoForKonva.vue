<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import Konva from 'konva';
import DefaultLayout from '@/layout/DefaultLayout.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showBadge = computed(() => route.path !== '/konva3');

const stageSize = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
});

const shapes = ref([]);
const selectedShapeName = ref('');
const selectedImageName = ref('');
const transformer = ref(null);
const transformerForImage = ref(null);

const images = ref([]);
const circles = ref([]);
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
        updateTransformer();
        updateTransformerForImage();
        return;
    }

    if (e.target.getParent()?.className === 'Transformer') {
        return;
    }

    const name = e.target.name();
    if (shapes.value.some((r) => r.name === name)) {
        selectedShapeName.value = name;
        selectedImageName.value = '';
    } else if (images.value.some((img) => img.name === name)) {
        selectedImageName.value = name;
        selectedShapeName.value = '';
    } else {
        selectedShapeName.value = '';
        selectedImageName.value = '';
    }

    updateTransformer();
    updateTransformerForImage();
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

watch(selectedShapeName, updateTransformer);
watch(selectedImageName, updateTransformerForImage);

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

const loadImages = () => {
    console.log("Image Clicked");
    const imgObj = new Image();
    imgObj.src = '/images/nature.png';
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
    <DefaultLayout :showBadge="showBadge">
        <div class="flex h-screen">
            <div class="flex flex-col space-y-5 font-bold bg-gray-200 p-6 w-64">
                <button class="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600" @click="loadImages">Add
                    Picture</button>
                <button class="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600" @click="addShape">Add
                    Shape</button>
                <button class="bg-yellow-200 text-black py-2 px-6 rounded-md hover:bg-green-600" @click="addCircle">Add
                    Circle</button>
                <input v-model="textValue" class="border p-2 rounded-md" placeholder="Enter text" />
                <button class="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600"
                    @click="addTextNode">Add Text</button>
            </div>
            <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown">
                <v-layer ref="layer">
                    <!-- Rectangles -->
                    <v-rect v-for="item in shapes" :key="item.id" :config="item" @transformend="handleTransformEnd" />
                    <!-- Circles -->
                    <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" draggable />
                    <!-- Text Nodes -->
                    <v-text v-for="(text, index) in textNodes" :key="index" :config="text" draggable />
                    <!-- Images -->
                    <v-image v-for="(image, index) in images" :key="index" :config="{ ...image, image: image.image }"
                        draggable @transformend="handleTransformEndForImage" />
                    <!-- Transformer -->
                    <v-transformer ref="transformer" />
                    <v-transformer ref="transformerForImage" />
                </v-layer>
            </v-stage>
        </div>
    </DefaultLayout>
</template>
