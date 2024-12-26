<script setup lang="ts">
import { ref, onMounted } from 'vue';
import genAiService from '@/services/gen-ai'

// Define Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cardTwo: {
    type: Object,
    default: () => ({
      credit: "0"
    })
  }
});
interface Plan {
  name: string;
  credits: number;
  price: number;
}
// Emits
const emit = defineEmits(['close'])

// State
const prompt = ref<string | null>(null);
const plans = ref<Plan[]>([]); // Store fetched subscription plans

// Close the modal
const close = () => {
  emit('close');
  prompt.value = "";
};

// Handle clicks outside of modal to close it
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    close();
  }
};

// Fetch subscription plans
const fetchprops = async () => {
  try {
    const response = await genAiService.fetchSubscribePlan();
    // console.log(response.data);  // Log the response to verify the data structure
    plans.value = response.data.map((plan) => {
      if (plan.storageLimit == null && plan.planTier == null) {
        return {
          name: plan.planName || 'No Name Provided',
          credits: plan.credits || 0,
          price: plan.price || 0,
        };
      } else {
        return null;
      }
    }).filter((plan) => plan !== null); // Filter out null plans
    console.log("sss",plans.value)
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
};

// Handle extra credit purchase
const extraCreditBuy = async (plan: Plan) => {
  try {
    console.log("Selected plan:", plan); // Log the selected plan
    const response = await genAiService.subscribePackages(plan.name, false, "Monthly");
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
};


// Call fetchprops when component is mounted
onMounted(() => {
  fetchprops(); // Call the function to fetch plans
});
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" @click="handleOutsideClick">

    <div class="bg-white rounded-lg shadow-md w-1/3">
      <div class="bg-tertiary p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl text-black font-bold">My Credits:</h2>
            <h2 class="text-2xl text-black font-bold">{{ props.cardTwo.credit }}</h2>
            <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-1">
          </div>
          <div class="flex items-center ml-auto pr-5">
            <img src="/images/zeuxis.png" alt="Logo" class="h-10 w-40 bg-silverChalice">
          </div>
        </div>

        <div class="flex flex-col space-y-1">
          <p class="text-ravenBlack text-md font-bold">Credits Purchase</p>
          <p class="text-silverChalice text-xs break-words">
            Note: To enjoy subscriber benefits such as fast track, you must have an active subscription plan; buying extra credits alone will not suffice. Credits expire in 2 years and are non-transferable and non-refundable.
          </p>
        </div>
      </div>

      <!-- Cards Container -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 h- w-full">
        <div v-for="(feature, index) in plans" :key="index" class="bg-tertiary p-4 rounded-lg flex flex-col justify-between shadow-sm h-355 items-center">
          <div class="flex items-center justify-start w-full">
            <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-2 mb-10 mr-2">
            <button @click="extraCreditBuy(feature)" class="flex flex-col items-center">
                <p class="text-xl font-bold">{{ feature.credits }}</p>
                <p class="text-xl font-bold mt-2">${{ feature.price }}</p>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling adjustments */
</style>
