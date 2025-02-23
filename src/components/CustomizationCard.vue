<script setup>
import { FwbCard } from 'flowbite-vue'
import { defineEmits, ref, watch } from 'vue'
import ColorEffectModal from './ColorEffectModal.vue'

// Define emitted events
const emit = defineEmits(['selectRatio', 'selectedEffectId'])

const props = defineProps({
  resetKey: {
    default: 0,
  }
});

watch(
  () => props.resetKey,
  () => {
    resetSelection()
  }
);

// Default selections
const selectedImageEffectTitle = ref('')
const selectedImageEffectPrompt = ref('')
const effectInfoModalOpen = ref(false)
const selectedImageId = ref('')
const selectedEffectimage = ref('')
const effectShow = ref(true)
const effectImagesShow = ref(false)
const isDropdownOpen = ref(false)
const selectedRatio = ref('portrait_16_9')
const selectedRatioIcon = ref('/images/icon/portrait.svg')
const selectedRatioText = ref('Portrait')

// Handle button click instantly
const handleSelection = (ratio) => {
  selectedRatio.value = ratio
  emit('selectRatio', ratio)
  isDropdownOpen.value = false
  if (ratio === 'portrait_16_9') {
    selectedRatioIcon.value = '/images/icon/portrait.svg'
    selectedRatioText.value = 'Portrait'
  } else {
    selectedRatioIcon.value = '/images/icon/landscape.svg'
    selectedRatioText.value = 'Landscape'
  }
}

// handle dropdownShow
const ratios = [
  { id: 'portrait_16_9', name: 'Portrait', icon: '/images/icon/portrait.svg' },
  { id: 'landscape_16_9', name: 'Landscape', icon: '/images/icon/landscape.svg' },
]

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
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
          <div class="flex gap-1 cursor-pointer">
            <div
              v-if="selectedImageEffectTitle"
              @click="resetSelection"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <img src="/images/icon/reset.svg" alt="reset" />
            </div>

            <div
              @click="arrowUp"
              class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <img src="/images/icon/down-arrow.svg" alt="arrow down" />
            </div>
          </div>
        </span>

        <!-- Images Ratio show start-->

        <div
          v-if="effectShow"
          class="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 mt-3 overflow-y-auto max-h-60 cursor-pointer"
        >
          <div
            v-for="(ratio, index) in ratioImages"
            :key="index"
            @click="handleEffectSelection(ratio.name, ratio.prompt, ratio.id, ratio.image)"
            class="relative w-14 h-14 sm:w-16 sm:h-14 rounded-sm overflow-hidden"
            :class="{
              'opacity-100 shadow-lg': selectedImageId === ratio.id,
              'border-transparent': selectedImageId !== ratio.id,
            }"
          >
            <img
              :src="ratio.image"
              alt="Portrait Button"
              class="w-full h-full object-cover rounded-sm opacity-80"
            />
            <p
              class="absolute bottom-0 left-0 w-full ml-1 text-white font-inter font-semibold text-[10px] leading-[12.1px] tracking-[2%]"
            >
              {{ ratio.name }}
            </p>

            <div v-if="selectedImageId === ratio.id" class="absolute top-1 right-1 p-1">
              <img src="/public/images/icon/presetSelection.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <div class="relative">
          <!-- Portrait Button -->
          <button
            @click="toggleDropdown"
            class="py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200 bg-white text-black-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
          >
            <img
              :src="selectedRatioIcon"
              alt="Selected Ratio"
              class="mr-1.5 w-4 h-4 sm:w-5 sm:h-5"
            />
            <span class="text-xs sm:text-sm">{{ selectedRatioText }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen"
            class="absolute bottom-full mb-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          >
            <div
              v-for="ratio in ratios"
              :key="ratio.id"
              @click="handleSelection(ratio.id)"
              class="flex justify-between w-full px-4 py-2 text-sm text-black-2 hover:bg-gray-100"
              :class="{ 'bg-gray-200': selectedRatio === ratio.id }"
            >
              <div class="flex items-center">
                <img :src="ratio.icon" alt="" class="mr-2 w-4 h-4" />
                {{ ratio.name }}
              </div>
              <img
                v-if="selectedRatio === ratio.id"
                src="/images/icon/Check.svg"
                alt="Selected"
                class="w-4 h-4"
              />
            </div>
          </div>
        </div>
        <button
          @click="openEffects"
          v-if="!selectedEffectimage"
          :class="[
            ' p-2 rounded-xl font-semibold flex items-center border transition-colors duration-200',
          ]"
        >
          <img src="/images/icon/brush.svg" alt="brush icon" class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <!-- Landscape Button -->
        <button
          v-if="selectedEffectimage"
          @click="arrowUp()"
          :class="[
            'py-2 px-6 rounded-xl font-semibold flex items-center border transition-colors duration-200',
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
