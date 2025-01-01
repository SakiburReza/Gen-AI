<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ShowModalForImage from './ShowModalForImage.vue';
import BuyMoreCreditsModal from './BuyMoreCreditsModal.vue';
import InvoiceCard from '@/components/InvoiceCard.vue'

const props = defineProps({
  cardOne: {
    type: Object,
    default: () => ({
      title: "Next Up Creator",
      credit: "2000",
      date: "Jan.11, 2025",
    }),
  },
  cardTwo: {
    type: Object,
    default: () => ({
      credit: "20"
    })
  },
  cardThree: {
    type: Object,
    default: () => ({
      price: "$20.00/month",
      billingDate: "Jan. 11, 2025"
    })
  }

});
const showBuyMoreCreditsModal = ref(false) // Modal visibility
const BuyMoreCredits = async () => {
  console.log("Executing More Credits");
  showBuyMoreCreditsModal.value = true
};
const closeBuyMoreCreditsModal = () => {
  showBuyMoreCreditsModal.value = false

}

const showInvoiceCard = ref(false);


function toggleInvoiceCard() {
  showInvoiceCard.value = !showInvoiceCard.value;
}

function closeInvoiceCard() {
  showInvoiceCard.value = false;
}

// Close AccountCard when clicking outside
function handleClickOutside(event) {
  const invoiceCard = document.querySelector('.account-card');
  if (invoiceCard && !invoiceCard.contains(event.target)) {
    closeInvoiceCard();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});


// Dynamic dashed line
const dashLength = ref(26); // Adjust this number for dash length
const dashedLine = computed(() => '- '.repeat(dashLength.value).trim());
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold mb-4">Billing</h1>
      <!-- <h1 class="text-3xl font-bold mb-4">Subscription</h1> -->
      <!-- Button Hidden on Mobile and Shown on Medium Screens and Above -->
      <button @click="() => $router.push('/operativepage')"
        class="hidden md:inline-block mb-5 bg-blue-600 text-white px-6 py-4 rounded-lg text-sm">
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
            <h3 class="text-xl font-semibold mb-1">{{ cardOne.title }}</h3>
            <div class="flex items-center justify-between">
              <p class="text-silverChalice mb-4 text-sm">Monthly</p>
              <p class="text-md flex items-center text-silverChalice">
                <img src="/public/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2">
                {{ cardOne.credit }}
              </p>
            </div>
            <br>
            <div class="border-solid lg:border-dashed">
              <p class="text-center text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <br>
            <div class="flex items-center justify-between">
              <p class="text-xs text-silverChalice mt-2">Plan renews on {{ cardOne.date }}</p>
              <button
                class="text-sm bg-ravenBlack text-white px-4 py-2 rounded-2xl hover:bg-ravenBlack whitespace-nowrap">
                Change Plan
              </button>
            </div>
          </div>
        </div>

        <!-- Purchased Credits Card -->
        <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <h3 class="text-xl font-semibold mb-1">Purchased</h3>
            <div class="flex items-center justify-between">
              <p class="text-silverChalice mb-4 text-sm">Credits</p>
              <p class="text-md flex items-center text-silverChalice">
                <img src="/public/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2">
                {{ cardTwo.credit }}
              </p>
            </div>
            <br>
            <div class="border-solid lg:border-dashed">
              <p class="text-center text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-silverChalice mt-1">Expires 2 years from date purchased</p>
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
            <br><br>
            <div class="border-solid lg:border-dashed">
              <p class="text-center text-sm md:text-base lg:text-lg">{{ dashedLine }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-silverChalice mb-2 text-sm">Price</p>
              <p class="font-bold text-lg">{{ cardThree.price }}</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-silverChalice mb-2 text-sm">Billing date</p>
              <p class="font-bold text-md">{{ cardThree.billingDate }}</p>
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
    <InvoiceCard
      class="absolute-middle z-50 mx-auto sm:right-12 sm:max-w-sm md:right-16 md:max-w-md lg:right-20 lg:max-w-lg xl:right-80 xl:max-w-xl rounded-md p-4"
      v-if="showInvoiceCard" @close="toggleInvoiceCard" />
  </div>

</template>
<style scoped></style>
