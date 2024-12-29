<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SubscriptionCard from '@/components/SubscriptionCard.vue';
import Navbar from '@/components/Navbar.vue';
import SubscriptionBillingCard from '@/components/SubscriptionBillingCard.vue';
import genAiService from '@/services/gen-ai'

const plans = ref([]); // Create a ref for the plans list
const isButtonDisabled = ref(false); // Track button state (whether it is disabled)

const fetchPlans = async () => {
  try {
    const response = await genAiService.fetchSubscribePlan();
    plans.value = response.data.map((plan) => {
      // Check if both storageLimit and planTier are not null
      if (plan.storageLimit != null && plan.planTier != null) {
        return {
          title: plan.planName || 'No Name Provided',
          featureList: [
            { name: `${plan.credits || 0} Credits`, isActive: true },
            { name: `${plan.storageLimit || 0} GB of Storage`, isActive: plan.storageLimit != null },
            {
              name: plan.faceSwapAccess ? plan.faceSwapAccess.replace(/"/g, '') : 'No Access to Face Swap',
              isActive: (plan.faceSwapAccess && !plan.faceSwapAccess.includes('No'))
            },
            {
              name: plan.templateAccess ? plan.templateAccess.replace(/"/g, '') : 'No Access to Template',
              isActive: (plan.templateAccess && !plan.templateAccess.includes('No'))
            },
            {
              name: plan.creatorAccess ? plan.creatorAccess.replace(/"/g, '') : 'No Access to Creator',
              isActive: (plan.creatorAccess && !plan.creatorAccess.includes('No'))
            },
          ],
          comments: plan.planTier || 'No Tier Provided',
          price: `$${(plan.price || 0).toFixed(2)}`,
        };
      } else {
        // If storageLimit or planTier is null, return null or handle accordingly
        return null;
      }
    }).filter(plan => plan != null);  // Filter out null plans
    console.log("ssaa", plans.value)
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
};

onMounted(() => {
  fetchPlans(); // Call the function to fetch plans
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar :title="activeFunctionality" />

    <div class="pt-6 sm:pt-10 lg:pt-15 flex justify-center mb-5">
      <SubscriptionBillingCard />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-2 p-4">
      <!-- Loop through the plans dynamically -->
      <SubscriptionCard 
        v-for="(feature, index) in plans" 
        :key="index" 
        :data="feature" 
        :isStyle="index % 2 == 0" 
        :isButtonDisabled="isButtonDisabled"
        @button-clicked="isButtonDisabled = true" 
      />
    </div>

    <!-- Button Shown Only on Mobile -->
    <div class="md:hidden w-full md:w-1/3 mx-auto pb-10 px-4 sm:px-6 pt-5">
      <button @click="() => $router.push('/operativepage')"
        class="w-3/4 sm:w-1/2 bg-blue-600 text-white text-xs sm:text-sm py-2 sm:py-3 rounded-md hover:bg-gray-800 mx-auto block">
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>
  </div>
</template>
