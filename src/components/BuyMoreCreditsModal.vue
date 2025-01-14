<script setup lang="ts">
import { ref, onMounted } from 'vue';
import genAiService from '@/services/gen-ai'
import { useCredits } from '@/utils/utils';

const { credits, fetchCredits } = useCredits();

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
    console.log("sss", plans.value)
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
};

// Handle extra credit purchase
const extraCreditBuy = async (plan: Plan) => {
  try {
    console.log("Selected plan:", plan); // Log the selected plan
    const response = await genAiService.subscribePackages(plan.name, false, "Month");
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
  <div v-if="props.isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    @click="handleOutsideClick">

    <div class="bg-white rounded-lg shadow-md w-full max-w-lg mx-4 md:w-1/1">
      <div class="bg-tertiary p-6 ">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div class="flex items-center justify-between space-x-4">
            <div class="flex items-center space-x-4">
              <h2 class="text-xl md:text-2xl text-black font-bold">My Credits:</h2>
              <h2 class="text-xl md:text-2xl text-black font-bold">{{ credits }}</h2>
              <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-1">
              <img src="/images/zeuxis.png" alt="Logo" class="h-8 md:h-11 w-auto pl-36">
            </div>
          </div>

        </div>

        <div class="flex flex-col space-y-2 mt-4">
          <p class="text-ravenBlack text-md font-bold">Credits Purchase</p>
          <p class="text-xs break-words">
            Note: Credits expire in 2 years and are non-transferable and non-refundable.
          </p>
        </div>
      </div>

      <!-- Cards Container -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
        <div v-for="(feature, index) in plans" :key="index"
          class="bg-tertiary p-4 rounded-lg flex flex-col justify-between shadow-sm h-355 items-end group hover:bg-blue-600 transition-all duration-300">
          <div class="flex items-center justify-center w-full">
            <img src="/public/images/icon/StartIcon.svg" alt="Start Icon"
              class="w-4 h-5 ml-2 mb-14 mr-0.5 group-hover:filter group-hover:brightness-0 group-hover:invert">
            <button @click="extraCreditBuy(feature)"
              class="flex flex-col items-center p-4 rounded-lg transition-all duration-300">
              <!-- Hover effect on the <p> tags based on the parent .group hover state -->
              <p class="text-3xl md:text-xl font-bold text-gray-800 mt-2 group-hover:text-white">{{ feature.credits
                }}</p>
              <br>
              <p class="text-lg md:text-md font-semibold text-ravenBlack mt-2 group-hover:text-white">${{ feature.price
                }}
              </p>
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
