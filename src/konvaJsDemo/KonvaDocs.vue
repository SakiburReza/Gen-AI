<script setup>
import { ref, onMounted } from 'vue';

const stage = ref(null);
const dragLayer = ref(null);
const layer = ref(null);
const text = ref("Hover over the shape");
const image = ref(null);
const isDragging = ref(false);
const isImageDragging = ref(false);
const transformer = ref(null);
const rectangles = ref([
    { id: 1, x: 50, y: 60, width: 100, height: 100, fill: 'red', draggable: true },
    { id: 2, x: 200, y: 100, width: 120, height: 80, fill: 'blue', draggable: true }
]);

const configKonva = ref({
    width: 200,
    height: 200
});
const stageSize = ref({
    width: 500,
    height: 400
});

const configCircle = ref({
    x: 100,
    y: 100,
    radius: 70,
    fill: "red",
    stroke: "black",
    strokeWidth: 5
});
const handleMouseMove = () => {
    text.value = "Mouse is over the shape!";
};

const handleMouseOut = () => {
    text.value = "Hover over the shape";
};

const handleDragStart = () => {
    isDragging.value = true;
};

const handleDragEnd = () => {
    isDragging.value = false;
};
const handleImageDragStart = () => {
    isImageDragging.value = true;
};

const handleImageDragEnd = () => {
    isImageDragging.value = false;
};
const handleStageMouseDown = (e) => {
    if (!transformer.value) return;

    const tr = transformer.value.getNode();
    if (e.target === e.target.getStage()) {
        tr.nodes([]);
        return;
    }

    const selectedNode = e.target;
    if (!selectedNode) return;

    tr.nodes([selectedNode]);
    tr.getLayer().batchDraw();
};

const handleTransformEnd = (e) => {
    const node = e.target;
    const rect = rectangles.value.find(item => item.id === node._id);
    if (rect) {
        rect.x = node.x();
        rect.y = node.y();
        rect.width = node.width() * node.scaleX();
        rect.height = node.height() * node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
    }
};
onMounted(() => {
    const img = new window.Image();
    img.src = 'public/images/nature.png';
    img.onload = () => {
        image.value = img;
    };
    if (transformer.value && layer.value) {
        const tr = transformer.value.getNode();
        layer.value.getNode().add(tr);
    }
});


</script>

<template>
    <div class="bg-tertiary">
        <div class="bg-tertiary">
            <h6>Just a circle</h6>
            <v-stage :config="configKonva">
                <v-layer>
                    <v-image :config="{ image: image }" />
                    <v-circle :config="configCircle"></v-circle>
                </v-layer>
            </v-stage>
        </div>
        <div class="float-end">
            <v-stage ref="stage" :config="stageSize">
                <v-layer>

                    <v-text :config="{ text: 'Demo Shapes', fontSize: 20 }" />
                    <v-rect :config="{
                        x: 20,
                        y: 50,
                        width: 100,
                        height: 100,
                        fill: 'red',
                        shadowBlur: 10
                    }" />
                    <v-circle :config="{
                        x: 200,
                        y: 100,
                        radius: 50,
                        fill: 'green'
                    }" />
                    <v-line :config="{
                        x: 20,
                        y: 200,
                        points: [0, 0, 100, 0, 100, 100],
                        tension: 0.5,
                        closed: true,
                        stroke: 'black',
                        fillLinearGradientStartPoint: { x: -50, y: -50 },
                        fillLinearGradientEndPoint: { x: 50, y: 50 },
                        fillLinearGradientColorStops: [0, 'red', 1, 'yellow']
                    }" />
                </v-layer>
                <v-layer ref="dragLayer"></v-layer>
            </v-stage>
        </div>
        <div class="bg-white float-right">
            <v-stage ref="stage" :config="stageSize">
                <v-layer ref="layer">
                    <!-- <v-image :config="{ image: image }" /> -->
                    <v-image @dragstart="handleImageDragStart" @dragend="handleImageDragEnd" :config="{
                        image: image,
                        x: 100,
                        y: 100,
                        draggable: true
                    }" />
                    <v-regular-polygon @mousemove="handleMouseMove" @mouseout="handleMouseOut" :config="{
                        x: 80,
                        y: 120,
                        sides: 3,
                        radius: 80,
                        fill: '#00D2FF',
                        stroke: 'black',
                        strokeWidth: 4
                    }" />
                    <v-text :config="{
                        x: 10,
                        y: 10,
                        fontFamily: 'Calibri',
                        fontSize: 24,
                        text: text,
                        fill: 'black'
                    }" />
                    <v-text @dragstart="handleDragStart" @dragend="handleDragEnd" :config="{
                        text: 'You can drag and drop this text',
                        x: 100,
                        y: 100,
                        draggable: true,
                        fill: isDragging ? 'green' : 'black'
                    }" />
                </v-layer>
            </v-stage>
        </div>
        <div>
            <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown"
                @touchstart="handleStageMouseDown">
                <v-layer ref="layer">
                    <v-rect v-for="item in rectangles" :key="item.id" :config="item"
                        @transformend="handleTransformEnd" />
                    <v-transformer ref="transformer" />
                </v-layer>
            </v-stage>
        </div>
        <div>
            <!-- <v-stage ref="stage" :config="stageSize">
            <v-layer ref="layer">
               
            </v-layer>
        </v-stage> -->

            <v-stage ref="stage" :config="stageSize" @mousedown="handleStageMouseDown"
                @touchstart="handleStageMouseDown">
                <v-layer ref="layer">
                    <v-image :config="{ image: image }" />
                    <!-- <v-rect v-for="item in rectangles" :key="item.id" :config="item" @transformend="handleTransformEnd" /> -->
                    <v-transformer ref="transformer" />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>
