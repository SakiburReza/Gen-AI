<template>
  <div ref="containerRef" class="konva-container">
    <div class="toolbar">
      <button @click="showTextOptions = !showTextOptions">Adjust Text Size</button>
      <input v-if="showTextOptions" type="range" min="10" max="100" v-model="fontSize" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Konva from 'konva';

export default {
  setup() {
    const containerRef = ref(null);
    const showTextOptions = ref(false);
    const fontSize = ref(20);
    let textElement = null;
    let textTransformer = null;

    onMounted(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const stage = new Konva.Stage({
        container: containerRef.value,
        width,
        height,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      // Add a text element
      textElement = new Konva.Text({
        x: stage.width() / 2 - 50,
        y: 40,
        fontSize: fontSize.value,
        text: 'Random employee from CNS',
        draggable: true,
      });
      layer.add(textElement);

      // Add transformer for text resizing
      textTransformer = new Konva.Transformer({
        nodes: [textElement],
        enabledAnchors: ['middle-left', 'middle-right','top-left', 'top-right', 'bottom-left', 'bottom-right','bottom-center','top-center'],
        boundBoxFunc: (oldBox, newBox) => {
          if (Math.abs(newBox.width) < 20) {
            return oldBox;
          }
          return newBox;
        },
      });
      layer.add(textTransformer);

      textElement.on('transform', () => {
        textElement.setAttrs({
          width: Math.max(textElement.width() * textElement.scaleX(), 20),
          scaleX: 1,
        });
      });

      // Load Image
      const imageObj = new Image();
      imageObj.onload = () => {
        const image = new Konva.Image({
          image: imageObj,
          x: stage.width() / 2 - 100,
          y: stage.height() / 2 - 68.5,
          width: 200,
          height: 137,
          draggable: true,
        });

        const imageTransformer = new Konva.Transformer({
          nodes: [image],
          enabledAnchors: ['top-left', 'top-right', 'bottom-left','bottom-center', 'bottom-right','top-center','middle-left', 'middle-right'],
          rotateEnabled: true,
        });

        layer.add(image);
        layer.add(imageTransformer);
        layer.draw();
      };

      imageObj.src = '/images/myImg.jpg';
    });

    // Watch for font size changes
    watch(fontSize, (newSize) => {
      if (textElement) {
        textElement.fontSize(newSize);
        textElement.getLayer().batchDraw();
      }
    });

    return { containerRef, showTextOptions, fontSize };
  },
};
</script>

<style>
.konva-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

button {
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
}

input[type="range"] {
  width: 100px;
}
</style>
