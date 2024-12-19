<script setup lang="ts">
import SubscriptionCard from '@/components/SubscriptionCard.vue'
import Navbar from '@/components/Navbar.vue'

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
  <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
    Subscription
  </h2>
</div>


    <div class="flex flex-col lg:flex-row gap-40 items-center justify-center flex-1 pl-15">
      <SubscriptionCard v-for="(feature, index) in plans" :key="index" :data="feature" :isStyle="index % 2 == 0" />
    </div>
      <!-- Back Button -->
    <div class="w-full md:w-1/3 mx-auto pb-10 pl-50 pr-40">
  <button class="w-full bg-blue-600 text-white text-sm py-3 rounded-md hover:bg-gray-800">
    TAKE ME BACK I WANT TO CREATE
  </button>
  <br>
</div>
</div>

</template>

<style scoped>
/* Optional Custom Styles */
</style>