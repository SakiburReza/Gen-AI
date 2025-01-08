<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import genAiService from '@/services/gen-ai'
import { useRouter } from 'vue-router'

const router = useRouter() // Vue Router instance
// Define the emits to handle custom events
const emit = defineEmits(['button-clicked'])

// Define props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: 'Basic Creator',
      featureList: [
        { name: '2250 Credits', isActive: true },
        // { name: "50 GB of Storage", isActive: true },
        { name: 'No Access to Face Swap', isActive: false },
        { name: 'No Access to Templates', isActive: false },
        { name: 'No Access to Creator Network', isActive: false },
      ],
      comments: 'Lowest!',
      price: '$12.99',
    }),
  },
  isStyle: {
    type: Boolean,
    default: true,
  },
  isButtonDisabled: {
    type: Boolean,
    default: false,
  },
})

// State management
const creditInformation = ref({
  currentPackage: '',
  credits: 0,
  generatedBy: '',
  currentPackagePrice: 0,
})

const otherPrice = ref<number | null>(null)

// Methods
const ZeuxItNow = async () => {
  if (props.isButtonDisabled) return

  emit('button-clicked')

  try {
    const response = await genAiService.subscribePackages(props.data.title, false, 'Monthly')
    const redirectUrl = response.data

    if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      console.error('Redirect URL not found in the response')
    }
  } catch (error) {
    console.error('Error subscribing:', error)
  }
}

const fetchCurrentPrice = async () => {
  try {
    const response = await genAiService.getCreditInfo()
    if (response?.data?.currentPackagePrice) {
      creditInformation.value.currentPackagePrice =
        parseFloat(response.data.currentPackagePrice) || 0
    } else {
      console.error('Current package price not found in response', response)
      creditInformation.value.currentPackagePrice = 0
    }
  } catch (error) {
    console.error('Error fetching current price:', error)
  }
}
const fetchOtherPrice = async () => {
  try {
    const response = await genAiService.fetchSubscribePlan()

    if (response?.data) {
      const matchedPlan = response.data.find((plan) => plan.planName === props.data.title)

      if (matchedPlan?.price != null) {
        otherPrice.value = parseFloat(matchedPlan.price.toFixed(2)) || 0
      } else {
        console.error('Matching plan not found or price is missing')
        otherPrice.value = null
      }
    } else {
      console.error('Invalid response structure', response)
      otherPrice.value = null
    }
  } catch (error) {
    console.error('Error fetching other package price:', error)
    otherPrice.value = null
  }
}

// Computed properties
const buttonText = computed(() => {
  if (otherPrice.value === null) {
    return 'Loading...'
  }

  const currentPrice = creditInformation.value.currentPackagePrice
  if (currentPrice === otherPrice.value) {
    return 'Current Package'
  } else if (currentPrice > otherPrice.value) {
    return 'Downgrade'
  } else {
    return 'Upgrade'
  }
})

// Lifecycle hooks
onMounted(() => {
  fetchCurrentPrice()
  fetchOtherPrice()
})

watch(
  () => props.data.title,
  () => {
    fetchOtherPrice()
  },
)
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5">
    <!-- First Card Component -->
    <div
      :class="{
        // 'w-full max-w-md md:max-w-lg border rounded-3xl p-6 relative mx-auto': true,
        'w-full max-w-sm border rounded-3xl p-5 relative justify-start': true,
        'border-blue-600': isStyle,
        'bg-blue-600': !isStyle,
      }"
    >
      <!-- Title -->
      <h2
        class="text-3xl font-semibold mb-4 md:text-left"
        :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'"
      >
        {{ data.title }}
      </h2>

      <!-- Feature List with Radio Button -->
      <div class="space-y-2 mb-15">
        <label
          v-for="(feature, index) in data.featureList"
          :key="index"
          class="flex items-center space-x-3 sm:text-2xl md:text-2xl lg:text-xl"
        >
          <img
            v-if="feature.isActive && !isStyle"
            class="h-5 w-5"
            src="/images/icon/radio_button_checked.svg"
            alt=""
          />
          <img
            v-else-if="feature.isActive && isStyle"
            class="h-5 w-5"
            src="/images/icon/radio_button_checked_blue.svg"
            alt=""
          />
          <img v-else class="h-5 w-5" src="/images/icon/radio_button_checked_red.svg" alt="" />
          <span :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">
            {{ feature.name }}
          </span>
        </label>
      </div>

      <!-- Price Section with Badge -->
      <div class="relative mb-5 inline-block">
        <span
          class="absolute -top-7 left-1/4 -translate-x-1/4 bg-blue-600 text-white text-sm px-5 py-1 rounded-2xl -rotate-6 text-nowrap"
          :class="data.title === 'Next Up Creator' ? 'text-black bg-parrot' : 'text-black'"
        >
          {{ data.comments }}
        </span>

        <span
          class="text-3xl font-bold"
          :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'"
          >{{ data.price }}</span
        >
      </div>

      <!-- Separator -->
      <div class="border-t border-solid-black border-grey mb-6">
        <!-- <p class="mt-4 text-center">{{ dashedLine }}</p> -->
      </div>

      <!-- CTA Button -->
      <button
        @click="ZeuxItNow"
        :disabled="isButtonDisabled"
        :class="{
          'w-full text-sm py-3 rounded-lg': true,
          'bg-black text-white hover:bg-gray-800':
            buttonText !== 'Current Package' && !isButtonDisabled,
          'bg-gray-300 text-gray-500 cursor-not-allowed': isButtonDisabled,
          'bg-black text-white': buttonText === 'Current Package' && !isButtonDisabled,
        }"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
