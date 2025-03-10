<script setup lang="ts">
import InvoiceCard from '@/components/InvoiceCard.vue'
import genAiService from '@/services/gen-ai'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BuyMoreCreditsModal from './BuyMoreCreditsModal.vue'
import { useToastStore } from '@/stores/toast'
import router from '@/router'
const toastStore = useToastStore()

const emit = defineEmits(['subscription-change'])

const billinInformation = ref({
  plan_name: '',
  credit: '',
  last_billing_time: '',
  last_billing_amount: '',
  last_purchased_credit: '',
})

const goBack = () => {
  localStorage.setItem('selectedMenu', '/')
  sessionStorage.setItem('lastVisit', '')
  router.push('/')
}

const billingInfo = async () => {
  try {
    const response = await genAiService.billingInformation()
    if (response.data.status) {
      if (response.data.data.subscription) {
        billinInformation.value.plan_name =
          response.data.data.subscription.plan_name === null ||
            response.data.data.subscription.plan_name === 'null' ||
            response.data.data.subscription.plan_name === undefined
            ? 'No plan yet'
            : response.data.data.subscription.plan_name

        billinInformation.value.credit =
          response.data.data.subscription.credit === null ||
            response.data.data.subscription.credit === 'null' ||
            response.data.data.subscription.credit === undefined
            ? 0
            : response.data.data.subscription.credit
      }
      if (response.data.data.last_purchase) {
        billinInformation.value.last_billing_time =
          response.data.data.last_purchase.last_billing_time === null ||
            response.data.data.last_purchase.last_billing_time === 'null' ||
            response.data.data.last_purchase.last_billing_time === undefined
            ? 'No date available'
            : response.data.data.last_purchase.last_billing_time

        billinInformation.value.last_billing_amount =
          response.data.data.last_purchase.last_billing_amount === null ||
            response.data.data.last_purchase.last_billing_amount === 'null' ||
            response.data.data.last_purchase.last_billing_amount === undefined
            ? 0
            : response.data.data.last_purchase.last_billing_amount
      }
      billinInformation.value.last_purchased_credit =
        response.data.data.lastPurchaseCredit === null ||
          response.data.data.lastPurchaseCredit === undefined ||
          response.data.data.lastPurchaseCredit === 'null'
          ? 0
          : response.data.data.lastPurchaseCredit
    } else {
      console.error('Invalid response structure:', response)
    }
  } catch (error) {
    console.error('Error fetching billing information:', error)
  }
}

const showBuyMoreCreditsModal = ref(false) // Modal visibility
const BuyMoreCredits = async () => {
  showBuyMoreCreditsModal.value = true
}
const closeBuyMoreCreditsModal = () => {
  showBuyMoreCreditsModal.value = false
}

const showInvoiceCard = ref(false)

async function cancleAction() {
  const response = await genAiService.cancelSubscription()
  if (response.status) {
    emit('subscription-change', true)
    toastStore.success(response.data.message)
  }
}

function toggleInvoiceCard() {
  showInvoiceCard.value = !showInvoiceCard.value
}

function closeInvoiceCard() {
  showInvoiceCard.value = false
}

// Close AccountCard when clicking outside
function handleClickOutside(event) {
  const invoiceCard = document.querySelector('.account-card')
  if (invoiceCard && !invoiceCard.contains(event.target)) {
    closeInvoiceCard()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  billingInfo() // Fetch billing data on mount
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Dynamic dashed line
const dashLength = ref(26) // Adjust this number for dash length
const dashedLine = computed(() => '- '.repeat(dashLength.value).trim())
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold mb-4">Billing</h1>
      <!-- Button Hidden on Mobile and Shown on Medium Screens and Above -->
      <button @click="goBack"
        class="hidden md:relative md:w-auto md:inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:mb-10">
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>
    <!--  Subscription Section -->
    <div class="bg-lightWhite p-6 rounded-lg shadow-md">
      <h2 class="text-2xl text-silverChalice mb-4">Your Subscription</h2>

      <!-- Cards Container -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Next Up Creator Card -->
        <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <h3 class="text-xl font-semibold mb-1">{{ billinInformation.plan_name }}</h3>
            <div class="flex items-center justify-between">
              <p class="text-silverChalice mb-4 text-sm"></p>
              <p class="text-md flex items-center font-bold">
                <img src="/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2" />
                {{ billinInformation.credit }}
              </p>
            </div>
            <br />
            <div class="border-solid lg:border-dashed mt-4">
              <p class="text-center font-bold text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <br />
            <div class="flex items-center justify-between">
              <p class="text-xs text-silverChalice mt-2">
                <!-- {{ cardOne.date }} -->
              </p>
              <button @click="cancleAction"
                class="text-sm bg-ravenBlack text-white px-4 py-2 rounded-2xl hover:bg-ravenBlack whitespace-nowrap">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        <!-- Purchased Credits Card -->
        <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <h3 class="text-xl font-semibold mb-1">Purchased</h3>
            <div class="flex items-center justify-between">
              <p class="mb-4 text-sm">Credits</p>
              <p class="text-md flex items-center font-bold">
                <img src="/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2" />
                {{ billinInformation.last_purchased_credit }}
              </p>
            </div>
            <br />
            <div class="border-solid lg:border-dashed">
              <p class="text-center text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <div class="flex items-center justify-between mt-7">
              <p class="text-xs text-silverChalice mt-1"></p>
              <button @click="BuyMoreCredits"
                class="text-sm bg-ravenBlack text-white px-4 py-2 rounded-2xl hover:bg-ravenBlack whitespace-nowrap">
                Buy More
              </button>
            </div>
          </div>
        </div>

        <!-- Invoices Card -->
        <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold mb-1">Invoices</h3>
              <button class="text-sm text-blue-600 px-4 py-2 rounded-2xl whitespace-nowrap" @click="toggleInvoiceCard">
                Get invoice
              </button>
            </div>
            <br /><br />
            <div class="border-dashed border-da lg:border-dashed">
              <p class="text-center text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm">Price</p>
              <p class="font-bold text-lg">${{ billinInformation.last_billing_amount }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm">Billing date</p>
              <p class="font-bold text-md">{{ billinInformation.last_billing_time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <BuyMoreCreditsModal :isOpen="showBuyMoreCreditsModal" @close="closeBuyMoreCreditsModal" />
  </div>

  <div v-if="showInvoiceCard">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-opacity-25 z-40" @click="closeInvoiceCard"></div>

    <!-- Invoice Card -->
    <InvoiceCard class="absolute-middle z-50 mx-auto sm:right-12  md:right-16  lg:right-20  xl:right-80  rounded-md"
      v-if="showInvoiceCard" @close="toggleInvoiceCard" />
    <!-- <InvoiceCard
      class="absolute-middle z-50 mx-auto w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] rounded-md p-4"
      v-if="showInvoiceCard" @close="toggleInvoiceCard" /> -->

  </div>
</template>
<style scoped></style>
