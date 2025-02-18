<script setup>
import { FwbCard } from 'flowbite-vue'
import { defineEmits, ref } from 'vue'
import ColorEffectModal from './ColorEffectModal.vue'

// Define emitted events
const emit = defineEmits(['selectRatio', 'selectedEffectId'])

// Default selections
const selectedRatio = ref('portrait_16_9')
const selectedImageEffectTitle = ref('')
const selectedImageEffectPrompt = ref('')
const effectInfoModalOpen = ref(false)
const selectedImageId = ref('')
const selectedEffectimage = ref('')
const effectShow = ref(true)
const effectImagesShow = ref(false)

// Handle button click instantly
const handleSelection = (ratio) => {
  selectedRatio.value = ratio
  emit('selectRatio', ratio)
}

const handleEffectSelection = (name, prompt, id, image) => {
  selectedEffectimage.value = image
  selectedImageEffectTitle.value = name
  selectedImageEffectPrompt.value = prompt
  selectedImageId.value = id
  effectInfoModalOpen.value = !effectInfoModalOpen.value
  emit('selectedEffectId', id)
}

const resetSelection = () => {
  selectedImageEffectTitle.value = ''
  selectedImageEffectPrompt.value = ''
  selectedImageId.value = ''
  selectedEffectimage.value = ''
}

const arrowUp = () => {
  effectShow.value = !effectShow.value
}

const closeEffectInfoModal = () => {
  effectInfoModalOpen.value = false
}

const openEffects = () => {
  effectImagesShow.value = !effectImagesShow.value
}

const ratioImages = [
  {
    id: 1,
    name: 'Vivid',
    image: '/images/vivid.png',
    prompt:
      'Intensely saturated colors with high contrast, making every detail pop for a striking and dynamic look.',
  },
  {
    id: 2,
    name: 'Night',
    image: '/images/Night.png',
    prompt:
      'Deep shadows and rich dark tones with subtle highlights, capturing the moody and mysterious essence of nighttime.',
  },
  {
    id: 3,
    name: 'Abstract',
    image: '/images/abstract.png',
    prompt:
      'A surreal and artistic effect with distorted shapes, exaggerated colors, and unconventional contrasts for a creative and dreamlike aesthetic.',
  },
  {
    id: 4,
    name: 'Cool Blue',
    image: '/images/cool-blue.png',
    prompt:
      'An extremely contrasted cool white image with bright highlights, glowy skin, and a dramatic feel.',
  },
  {
    id: 5,
    name: 'B&W',
    image: '/images/bw.png',
    prompt:
      'A timeless monochrome effect with rich blacks, crisp whites, and balanced grays, emphasizing depth, texture, and emotion.',
  },
]
</script>

<template>
  <fwb-card class="max-w-sm mx-auto sm:max-w-md md:max-w-lg">
    <div class="p-5">
      <!-- <span>
        <img src="/images/icon/showView.svg" alt="Show View Button" />
      </span> -->
      <!-- Image Ratio -->
      <div v-if="effectImagesShow">
        <span class="flex justify-between items-center">
        <div class="flex gap-1">
          <img src="/images/icon/brush.svg" class="w-4 h-4" alt="brush" />
          <p class="text-xs sm:text-sm text-ravenBlack font-bold">Preset</p>
        </div>
        <div class="flex gap-2 cursor-pointer">
          <img  @click="arrowUp"  src="/images/icon/down-arrow.svg" alt="arrow down" />
          <img
            v-if="selectedImageEffectTitle"
            @click="resetSelection"
            src="/images/icon/reset.svg"
            alt="reset"
          />
        </div>
      </span>

      <!-- Images Ratio show start-->

      <div v-if="effectShow" class="flex flex-wrap gap-2 mt-3 overflow-y-auto max-h-40 cursor-pointer">
        <div
          v-for="(ratio, index) in ratioImages"
          :key="index"
          @click="handleEffectSelection(ratio.name, ratio.prompt, ratio.id, ratio.image)"
          class="relative w-14 h-14 sm:w-20 sm:h-18 rounded-lg overflow-hidden border-2"
          :class="{
            'border-blue-500 shadow-lg scale-105': selectedImageId === ratio.id,
            'border-transparent': selectedImageId !== ratio.id,
          }"
        >
          <img
            :src="ratio.image"
            alt="Portrait Button"
            class="w-full h-full object-cover rounded-lg"
          />
          <div
            v-if="selectedImageId === ratio.id"
            class="absolute inset-0 bg-blue-500/30 rounded-lg"
          ></div>

          <p
            class="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded-b-lg"
          >
            {{ ratio.name }}
          </p>
        </div>
      </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <!-- Portrait Button -->
        <button
          @click="handleSelection('portrait_16_9')"
          :class="[
            'py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200',
            selectedRatio === 'portrait_16_9'
              ? 'bg-tertiary text-black-2 border-tertiary'
              : 'bg-white text-black-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400',
          ]"
        >
          <img
            src="/images/icon/portrait.svg"
            alt="Portrait Button"
            class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
          />
          <span class="text-xs sm:text-sm">Portrait</span>
        </button>

        <!-- brush icon -->

        <button
         
          @click="handleSelection('landscape_16_9')"
          :class="[
            ' p-2 rounded-xl font-semibold flex items-center border transition-colors duration-200',
            selectedRatio === 'landscape_16_9'
              ? 'bg-tertiary text-black-2 border-tertiary'
              : 'bg-white text-black-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400',
          ]"
        >
        <img
            src="/images/icon/landscape.svg"
            alt="landscape Button"
            class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
          />
          <span class="text-xs sm:text-sm">Landscape</span>
        </button>
        <button @click="openEffects"
          v-if="!selectedEffectimage"
          :class="[
            ' p-2 rounded-xl font-semibold flex items-center border transition-colors duration-200'
          ]"
        >
          <img src="/images/icon/brush.svg" alt="Landscape Button" class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <!-- Landscape Button -->
        <button
          v-if="selectedEffectimage"
          @click="handleSelection()"
          :class="[
            'py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200'
          ]"
        >
          <img
            :src="selectedEffectimage"
            alt="Landscape Button"
            class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
          />
          <span class="text-xs sm:text-sm">{{ selectedImageEffectTitle }}</span>
        </button>
      </div>
    </div>
  </fwb-card>

  <ColorEffectModal
    :isOpen="effectInfoModalOpen"
    :title="selectedImageEffectTitle"
    :prompt="selectedImageEffectPrompt"
    @close="closeEffectInfoModal"
    @selectOption="handleEffectSelection"
  ></ColorEffectModal>
</template>
