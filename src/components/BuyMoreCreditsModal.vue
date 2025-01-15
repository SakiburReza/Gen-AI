<script setup lang="ts">
import { ref, onMounted } from 'vue'
import genAiService from '@/services/gen-ai'
import { useCredits } from '@/utils/utils'

const { credits, fetchCredits } = useCredits()

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  cardTwo: { type: Object, default: () => ({ credit: '0' }) },
  isButtonDisabled: { type: Boolean, default: false },
})

interface Plan {
  name: string
  credits: number
  price: number
}

const emit = defineEmits(['close'])

const prompt = ref<string | null>(null)
const plans = ref<Plan[]>([])
const selectedPlan = ref<number | null>(null)

const close = () => {
  emit('close')
  prompt.value = ''
}

const handleOutsideClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) close()
}

const fetchprops = async () => {
  try {
    const response = await genAiService.fetchSubscribePlan()
    plans.value = response.data
      .map((plan: any) =>
        plan.storageLimit == null && plan.planTier == null
          ? {
              name: plan.planName || 'No Name Provided',
              credits: plan.credits || 0,
              price: plan.price || 0,
            }
          : null,
      )
      .filter((plan) => plan !== null) as Plan[]
  } catch (error) {
    console.error('Error fetching plans:', error)
  }
}

const extraCreditBuy = async (plan: Plan) => {
  if (props.isButtonDisabled || !plan) return
  try {
    const response = await genAiService.subscribePackages(plan.name, false, 'Month')
    const redirectUrl = response.data
    if (redirectUrl) window.location.href = redirectUrl
    else console.error('Redirect URL not found in the response')
  } catch (error) {
    console.error('Error subscribing:', error)
  }
}

const handleClick = (index: number) => {
  selectedPlan.value = index
  extraCreditBuy(plans.value[index])
}

onMounted(fetchprops)
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    @click="handleOutsideClick"
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white rounded-lg shadow-md w-full max-w-lg mx-4 md:w-1/1">
      <div class="bg-tertiary p-6 ">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div class="flex items-center justify-between space-x-4">
            <div class="flex items-center space-x-4">
              <h2 class="text-xl md:text-2xl text-black font-bold">My Credits:</h2>
              <h2 class="text-xl md:text-2xl text-black font-bold">{{ credits }}</h2>
              <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-1">
              <img src="/images/zeuxis-logo.png" alt="Logo" class="h-8 md:h-2 w-auto pl-36">
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

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
        <div
          v-for="(feature, index) in plans"
          :key="index"
          @click="!props.isButtonDisabled && handleClick(index)"
          :class="{
            'bg-black text-gray-500 cursor-not-allowed':
              props.isButtonDisabled || (selectedPlan !== null && selectedPlan !== index),
            'bg-tertiary': selectedPlan === index,
            'hover:bg-blue-600': !props.isButtonDisabled && selectedPlan === null,
          }"
          class="p-4 rounded-lg flex flex-col justify-between shadow-sm h-355 items-end group transition-all duration-300 w-full text-left cursor-pointer"
          role="button"
          tabindex="0"
          aria-pressed="selectedPlan === index"
        >
          <div class="flex items-center justify-center w-full">
            <img
              src="/images/icon/StartIcon.svg"
              alt="Start Icon"
              class="w-4 h-5 ml-2 mb-14 mr-0.5"
            />
            <div class="flex flex-col items-center p-4 rounded-lg">
              <p class="text-3xl md:text-xl font-bold text-gray-800 mt-2">{{ feature.credits }}</p>
              <p class="text-lg md:text-md font-semibold text-ravenBlack mt-2">
                ${{ feature.price }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add hover and focus effects for better accessibility */
</style>
