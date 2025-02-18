<script setup>
import Konva from 'konva';
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showBadge = computed(() => route.path !== '/konva3');
const stageSize = reactive({ width: window.innerWidth, height: window.innerHeight });
const images = ref([]);
const shapes = ref([]);
const circles = ref([]);
const textNodes = ref([]);
const textValue = ref('Edit Text');
const containerRef = ref(null);
const selectedShapeName = ref('');
const transformer = ref(null);

const showImages = ref(false);
const showShapes = ref(false);
const showText = ref(false);

// Toggle functions
const toggleImagesVisibility = () => { showImages.value = true; };
const toggleShapeVisibility = () => { showShapes.value = true; };
const toggleTextVisibility = () => { showText.value = true; };

const closeImages = () => { showImages.value = false; };
const closeShapes = () => { showShapes.value = false; };
const closeText = () => { showText.value = false; };

// Load images into Konva
const loadImages = () => {
    const imgObj = new Image();
    imgObj.src = '/images/nature.png';
    imgObj.onload = () => {
        images.value.push({
            id: 'img1',
            image: imgObj,
            x: 50,
            y: 50,
            width: 200,
            height: 200,
            scaleX: 1,
            scaleY: 1,
            draggable: true,
            name: 'image1',
        });
    };
};

const handleTransformEnd = (e) => {
    const image = images.value.find((img) => img.name === selectedShapeName.value);
    if (image) {
        image.x = e.target.x();
        image.y = e.target.y();
        image.rotation = e.target.rotation();
        image.scaleX = e.target.scaleX();
        image.scaleY = e.target.scaleY();
        image.width = e.target.width();
        image.height = e.target.height();
    }
    const rect = this.rectangles.find(
        (r) => r.name === this.selectedShapeName
    );
    // update the state
    rect.x = e.target.x();
    rect.y = e.target.y();
    rect.rotation = e.target.rotation();
    rect.scaleX = e.target.scaleX();
    rect.scaleY = e.target.scaleY();

    // change fill
    rect.fill = Konva.Util.getRandomColor();
}

const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
        selectedShapeName.value = '';
        updateTransformer();
        return;
    }

    const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
        return;
    }

    const name = e.target.name();
    console.log(name);

    const foundImage = images.value.find((img) => img.id === name);
    if (foundImage) {
        selectedShapeName.value = name;
    } else {
        selectedShapeName.value = '';
    }
}

const rectangles = () => [
    shapes.value.push(
        {
            rotation: 0,
            x: 10,
            y: 10,
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1,
            fill: 'red',
            name: `shape-${shapes.value.length}`,
            draggable: true,
        },
    )
]


const addTextNode = () => {
    textNodes.value.push({
        text: textValue.value,
        x: 100,
        y: 100,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green',
        draggable: true,
        name: `text-${textNodes.value.length}`
    });
};

const addShape = () => {
    shapes.value.push({
        x: 100,
        y: 100,
        width: 150,
        height: 100,
        fill: 'blue',
        draggable: true,
        name: `shape-${shapes.value.length}`
    });
};
const addCircle = () => {
    circles.value.push({
        x: 100,
        y: 100,
        radius: 50,  // Add the radius property for the circle
        fill: 'blue',
        draggable: true,
        name: `circle-${circles.value.length}`
    });
};
</script>

<template>
        <div class="flex h-screen">
            <div class="flex flex-col space-y-5 font-bold bg-gray-200 p-6 w-64">
                <button class="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600" @click="loadImages">Add
                    Picture</button>
                <button class="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600" @click="addShape">Add
                    Shape</button>
                <button class="bg-yellow-200 text-black py-2 px-6 rounded-md hover:bg-green-600" @click="addCircle">Add
                    Circle</button>
                <button class="bg-yellow-900 text-black py-2 px-6 rounded-md hover:bg-green-600" @click="rectangles">Add
                    Rectangles</button>
                <input v-model="textValue" class="border p-2 rounded-md" placeholder="Enter text" />
                <button class="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600"
                    @click="addTextNode">Add Text</button>
            </div>
            <div class="flex flex-grow justify-center items-center bg-gray-100 top-5">
                <v-stage :config="stageSize" @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown">
                    <v-layer>
                        <v-image v-for="(image, index) in images" :key="index" :config="image" draggable
                            @transformend="handleTransformEnd" />
                        <v-transformer ref="transformer" />
                        <v-rect v-for="(shape, index) in shapes" :key="index" :config="shape" draggable />
                        <v-rect v-for="item in rectangles" :key="item.id" :config="item"
                            @transformend="handleTransformEnd" />
                        <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" draggable />
                        <v-text v-for="(text, index) in textNodes" :key="index" :config="text" draggable />

                    </v-layer>
                </v-stage>
            </div>
        </div>
</template>
