<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SubscriptionCard from '@/components/SubscriptionCard.vue'
import Navbar from '@/components/NavBar.vue'
import SubscriptionBillingCard from '@/components/SubscriptionBillingCard.vue'
import genAiService from '@/services/gen-ai'
import { useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useCredits } from '@/utils/utils'
import router from '@/router'
const route = useRoute()
const toastStore = useToastStore()
const { fetchCredits } = useCredits()

const plans = ref([]) // Create a ref for the plans list
const isButtonDisabled = ref(false) // Track button state (whether it is disabled)

const showBillingSection = ref(false) // Controls the visibility of the billing section
// Delay function to wait for the specified time (in milliseconds)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const fetchPlans = async () => {
  try {
    const response = await genAiService.fetchSubscribePlan()
    plans.value = response.data
      .map((plan) => {
        // Check if both storageLimit and planTier are not null
        if (plan.storageLimit != null && plan.planTier != null) {
          return {
            title: plan.planName || 'No Name Provided',
            featureList: [
              { name: `${plan.credits || 0} Credits`, isActive: true },
              // { name: `${plan.storageLimit || 0} GB of Storage`, isActive: plan.storageLimit != null },
              {
                name: plan.faceSwapAccess
                  ? plan.faceSwapAccess.replace(/"/g, '')
                  : 'No Access to Face Swap',
                isActive: plan.faceSwapAccess && !plan.faceSwapAccess.includes('No'),
              },
              {
                name: plan.templateAccess
                  ? plan.templateAccess.replace(/"/g, '')
                  : 'No Access to Template',
                isActive: plan.templateAccess && !plan.templateAccess.includes('No'),
              },
              {
                name: plan.creatorAccess
                  ? plan.creatorAccess.replace(/"/g, '')
                  : 'No Access to Creator',
                isActive: plan.creatorAccess && !plan.creatorAccess.includes('No'),
              },
            ],
            comments: plan.planTier || 'No Tier Provided',
            price: `$${(plan.price || 0).toFixed(2)}`,
          }
        } else {
          // If storageLimit or planTier is null, return null or handle accordingly
          return null
        }
      })
      .filter((plan) => plan != null) // Filter out null plans
  } catch (error) {
    console.error('Error fetching plans:', error)
  }
}

const toggleBillingSection = () => {
  showBillingSection.value = !showBillingSection.value // Toggles the billing section visibility
}
onMounted(async () => {
  fetchPlans() // Call the function to fetch plans
  if (route.query) {
    try {
      const payment = route.query.payment
      const customerId = route.query.customer
      if (payment === 'success' && customerId) {
        await delay(5000) // Wait for 5 seconds
        await fetchCredits()
        router.replace({ path: route.path })
      }
    } catch (error) {}
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />

    <transition
      name="fade"
      enter-active-class="transition-opacity duration-1000 ease-in-out"
      leave-active-class="transition-opacity duration-1000 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showBillingSection" class="pt-6 sm:pt-10 lg:pt-15 flex justify-center mb-5">
        <SubscriptionBillingCard />
      </div>
    </transition>

    <!-- Header and Button Section -->
    <div v-if="!showBillingSection" class="flex justify-between items-center mb-2 w-full">
      <h1
        v-show="!showBillingSection"
        class="text-xl sm:text-2xl lg:text-3xl font-bold text-center ml-6 xl:ml-70 transition-opacity duration-500 ease-in-out opacity-0"
        :class="{ 'opacity-100': !showBillingSection }"
      >
        Subscription
      </h1>
      <div class="flex justify-center sm:justify-center mr-5 xl:mr-70">
        <button
          @click="toggleBillingSection"
          class="w-auto bg-blue-600 text-white text-sm sm:text-md py-2 px-3 sm:py-2 sm:px-2 rounded-md hover:bg-gray-800 transition-all duration-300"
        >
          BILLING
        </button>
      </div>
    </div>

    <!-- Subscription Plans Section -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4 md:gap-10 sm:px-5 sm:my-3 xl:mx-40 lg:px-4 py-4 sm:py-2 lg:py-8 justify-items-center transition-all duration-500 ease-in-out"
    >
      <SubscriptionCard
        v-for="(feature, index) in plans"
        :key="index"
        :data="feature"
        :isStyle="index % 2 == 0"
        :isButtonDisabled="isButtonDisabled"
        @button-clicked="isButtonDisabled = true"
      />
    </div>

    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-2 lg:px-4 gap-4 md:gap-6 py-4 sm:py-2 lg:py-8 
         justify-items-center w-full max-w-full overflow-x-hidden transition-all duration-500 ease-in-out">
      <SubscriptionCard v-for="(feature, index) in plans" :key="index" :data="feature" :isStyle="index % 2 == 0"
        :isButtonDisabled="isButtonDisabled" @button-clicked="isButtonDisabled = true" />
    </div> -->

    <!-- Mobile-Specific Button -->
    <div
      v-if="!showBillingSection"
      class="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex items-center justify-center"
    >
      <button
        @click="() => $router.push('/operativepage')"
        class="w-full sm:w-auto bg-blue-600 text-white text-sm sm:text-md py-3 sm:py-3 px-6 rounded-md hover:bg-gray-800 mx-auto"
      >
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>

    <div v-else class="md:hidden w-full md:w-1/3 mx-auto pb-10 px-4 sm:px-6 pt-6">
      <button
        @click="() => $router.push('/operativepage')"
        class="w-3/4 sm:w-1/2 bg-blue-600 text-white text-xs sm:text-sm py-2 sm:py-3 rounded-md hover:bg-gray-800 mx-auto block"
      >
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>
    <br />
  </div>
</template>
