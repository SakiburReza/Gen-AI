<!-- <script setup lang="ts">
import SubscriptionCard from '@/components/SubscriptionCard.vue'
import Navbar from '@/components/Navbar.vue'
import SubscriptionBillingCard from '@/components/SubscriptionBillingCard.vue';

const plans = [
  {
    title: "Basic Creator",
    featureList: [
      { name: "2250 Credits", isActive: true },
      { name: "50 GB of Storage", isActive: true },
      { name: "No Access to Face Swap", isActive: false },
      { name: "No Access to Templates", isActive: false },
      { name: "No Access to Creator Network", isActive: false },
    ],
    comments: "Lowest!",
    price: "$12.99",
  },
  {
    title: "Next Up Creator",
    featureList: [
      { name: "9000 Credits", isActive: true },
      { name: "100 GB of Storage", isActive: true },
      { name: "Access to Face Swap", isActive: true },
      { name: "Access to Templates", isActive: true },
      { name: "No Access to Creator Network", isActive: false },
    ],
    comments: "BANG FOR BUCK",
    price: "$25.99",
  },
  {
    title: "JACKED UP",
    featureList: [
      { name: "UNLIMITED CREDITS", isActive: true },
      { name: "150 GB of Storage", isActive: true },
      { name: "Face Swap", isActive: true },
      { name: "Templates", isActive: true },
      { name: "Access to Creator Network", isActive: true },
    ],
    comments: "YOU A PRO?",
    price: "$94.99",
  },
];


</script>
<template>
  <div class="flex flex-col h-screen">
    <Navbar :title="activeFunctionality" />

    <div class="pt-6 sm:pt-10 lg:pt-15 flex justify-center mb-5">
      <SubscriptionBillingCard />
    </div>


    <div class="flex flex-col lg:flex-row gap-40 items-center justify-center flex-1 pl-5">
      <SubscriptionCard v-for="(feature, index) in plans" :key="index" :data="feature" :isStyle="index % 2 == 0" />
    </div>

    <div class="md:hidden w-full md:w-1/3 mx-auto pb-10 px-4 sm:px-6 pt-5">
      <button @click="() => $router.push('/')" class="w-3/4 sm:w-1/2 bg-blue-600 text-white text-xs sm:text-sm py-2 sm:py-3 rounded-md hover:bg-gray-800 mx-auto block">
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>
    <div class="w-full md:w-1/3 mx-auto pb-10 px-4 sm:px-6 pt-5">

    </div>


  </div>

</template>

<style scoped>
/* Optional Custom Styles */
title: plan.planName,
      featureList: [
        { name: `${plan.credits} Credits`, isActive: true },
        { name: `${plan.storageLimit} GB of Storage`, isActive: true },
        { name: plan.faceSwapAccess.replace(/"/g, ''), isActive: plan.faceSwapAccess.includes('Access') },
        { name: plan.templateAccess.replace(/"/g, ''), isActive: plan.templateAccess.includes('Access') },
        { name: plan.creatorAccess.replace(/"/g, ''), isActive: plan.creatorAccess.includes('Access') },
         { 
          name: plan.faceSwapAccess ? plan.faceSwapAccess.replace(/"/g, '') : 'No Face Swap Access', 
          isActive: plan.faceSwapAccess?.includes('No ') || false 
        },
        { 
          name: plan.templateAccess ? plan.templateAccess.replace(/"/g, '') : 'No Template Access', 
          isActive: plan.templateAccess?.includes('No ') || false 
        },
        { 
          name: plan.creatorAccess ? plan.creatorAccess.replace(/"/g, '') : 'No Creator Access', 
          isActive: plan.creatorAccess?.includes('No ') || false 
        }
      ],
      comments: plan.planTier,
      price: `$${plan.price.toFixed(2)}`,
</style> -->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SubscriptionCard from '@/components/SubscriptionCard.vue';
import Navbar from '@/components/Navbar.vue';
import SubscriptionBillingCard from '@/components/SubscriptionBillingCard.vue';
import genAiService from '@/services/gen-ai'

const plans = ref([]); // Create a ref for the plans list

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
      <SubscriptionCard v-for="(feature, index) in plans" :key="index" :data="feature" :isStyle="index % 2 == 0" />
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

<style scoped>
/* Optional Custom Styles */
</style>
