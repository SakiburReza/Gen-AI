<script setup lang="ts">
import { computed, ref } from 'vue';
import genAiService from '@/services/gen-ai'

// Define the emits to handle custom events
const emit = defineEmits<{
  (event: 'button-clicked'): void; // Define the event name and type
}>();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: "Basic Creator",
      featureList: [
        { name: "2250 Credits", isActive: true },
        { name: "50 GB of Storage", isActive: true },
        { name: "No Access to Face Swap", isActive: false },
        { name: "No Access to Templates", isActive: false },
        { name: "No Access to Creator Network", isActive: false },
      ],
      comments: "Lowest!",
      price: "$12.99"
    }),
  },
  isStyle: {
    type: Boolean,
    default: true,
  },
  isButtonDisabled: {
    type: Boolean,
    default: false, // Default to false, button is enabled initially
  }
});

const subscriptionLink = ref(''); // Store the subscription link

const ZeuxItNow = async () => {
  if (props.isButtonDisabled) return; // Prevent the button from being clicked if it's disabled

  // Emit an event to disable all buttons when one is clicked
  emit('button-clicked');

  // Prepare the reqData based on the selected plan
  const reqData = {
    subscribePackage: props.data.title, // Plan title
    recurringConfirmation: false,
    recurringCadence: null
  };

  try {
    const response = await genAiService.subscribePackages(props.data.title, false, "Monthly");
    const redirectUrl = response.data;
    console.log('Subscription successful:', response);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      console.error('Redirect URL not found in the response');
    }
  } catch (error) {
    console.error('Error subscribing:', error);
  }
}

// Dynamic dashed line
const dashLength = ref(28); // Adjust this number for dash length
const dashedLine = computed(() => '- '.repeat(dashLength.value).trim());
</script>

<template>
  <div class="flex flex-col md:flex-row md:gap-6 gap-4">
    <!-- First Card Component -->
    <div :class="{
      'w-full max-w-md md:max-w-lg border rounded-3xl p-6 relative mx-auto': true,
      'border-blue-600': isStyle,
      'bg-blue-600': !isStyle
    }">
      <!-- Title -->
      <h2 class="text-2xl font-bold mb-4 text-center md:text-left"
        :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">
        {{ data.title }}
      </h2>

      <!-- Feature List with Radio Button -->
      <div class="space-y-2 mb-6">
        <label v-for="(feature, index) in data.featureList" :key="index" class="flex items-center space-x-3">
          <img v-if="feature.isActive && !isStyle" class="h-5 w-5" src="/images/icon/radio_button_checked.svg" alt="">
          <img v-else-if="feature.isActive && isStyle" class="h-5 w-5" src="/images/icon/radio_button_checked_blue.svg"
            alt="">
          <img v-else class="h-5 w-5" src="/images/icon/radio_button_checked_red.svg" alt="">
          <span :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">
            {{ feature.name }}
          </span>
        </label>
      </div>

      <!-- Price Section with Badge -->
      <div class="relative mb-6 text-center">
        <span
          class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-5 py-0.5 rounded-2xl -rotate-6 text-nowrap"
          :class="data.title === 'Next Up Creator' ? 'text-black bg-parrot' : 'text-black'">
          {{ data.comments }}
        </span>

        <span class="text-3xl font-bold" :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">
          {{ data.price }}
        </span>
      </div>

      <!-- Separator -->
      <div class="border-t border-solid-black border-grey  mb-6 ">
        <!-- <p class="mt-4 text-center">{{ dashedLine }}</p> -->
      </div>

      <!-- CTA Button -->
      <button @click="ZeuxItNow" :disabled="isButtonDisabled" :class="{
        'w-full text-sm py-3 rounded-lg': true,
        'bg-black text-white hover:bg-gray-800': !isButtonDisabled,
        'bg-gray-300 text-gray-500 cursor-not-allowed': isButtonDisabled
      }">
        Zeux It Now
      </button>
    </div>
  </div>

</template>
