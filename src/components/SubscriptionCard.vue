<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import genAiService from '@/services/gen-ai'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useCredits } from '@/utils/utils'
const toastStore = useToastStore()
const { fetchCredits } = useCredits()

const router = useRouter() // Vue Router instance
// Define the emits to handle custom events
const emit = defineEmits(['button-clicked', 'package-changed'])

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
  creditInformation: {
    type: Object,
    default: {},
  }
})

// Methods
const ZeuxItNow = async () => {
  if (props.isButtonDisabled) return
  emit('button-clicked',true)

  try {
    let response, response2
    if (props.creditInformation.currentPackagePrice === 0) {
      response = await genAiService.subscribePackages(props.data.title, true, 'Month')
    } else {
      response2 = await genAiService.changesubscribePackages(props.data.title)
      if(response2.status){
        await fetchCredits();
        emit('button-clicked', false);
        toastStore.success(response2.data.message)
      }
    }
    toastStore.success(response.data.message)
    
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

// Computed properties
const buttonText = computed(() => {
  if (props.data?.priceOrig === null) {
    return 'Loading...'
  }

  const currentPrice = props.creditInformation.currentPackagePrice
  if (currentPrice === props.data?.priceOrig) {
    return 'Current Package'
  } else if (currentPrice > props.data?.priceOrig) {
    return 'Downgrade'
  } else {
    return 'Upgrade'
  }
})

</script>

<template>
  <div class="flex flex-col flex-wrap lg:flex-row gap-5 space-y-4 sm:space-y-6 min-w-90">
    <!-- First Card Component -->

    <div
      :class="{
        // 'w-full max-w-md md:max-w-lg border rounded-3xl p-6 relative mx-auto': true,

        // 'w-full max-w-sm border rounded-3xl p-5 relative justify-start': true,
        // 'border-blue-600': isStyle,
        // 'bg-blue-600': !isStyle,
        // 'scale-110': buttonText === 'Current Package',
        // 'bg-tertiary':data.title !=='Next Up Creator',

        'w-full mt-5 max-w-sm border rounded-3xl p-5 relative transition-transform duration-300': true,
        'border-blue-600': isStyle,
        'bg-blue-600': !isStyle,
        'scale-110 -translate-y-4': buttonText === 'Current Package',
        'translate-y-2': buttonText !== 'Current Package', // Keep in line
        'bg-tertiary': data.title !== 'Next Up Creator',
      }"

    >
      <!-- Title -->
      <h2
        class="text-3xl font-semibold mb-4 md:text-left "
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
          class="text-3xl font-semibold"
          :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'"
        >
          {{ data.price }}
          <span class="text-sm font-normal">/Month</span>
        </span>
      </div>

      <!-- Separator -->
      <div class="border-t border-solid-black border-grey mb-6">
        <!-- <p class="mt-4 text-center">{{ dashedLine }}</p> -->
      </div>

      <!-- CTA Button -->
      <button
        @click="ZeuxItNow"
        :disabled="props.isButtonDisabled"
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
