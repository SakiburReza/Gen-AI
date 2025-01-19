<template>
  <div
    v-if="isInvoiceVisible"
    class="fixed inset-0 flex justify-center items-center z-50"
    @click.self="closeInvoice"
  >
  <div class="w-full mx-auto bg-white border rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
    <!-- Header Row (this should always be visible) -->
    <div class="grid grid-cols-12 gap-0 md:gap-4 text-xs sm:text-sm font-bold text-black-2 border-b border-black-2 pb-4">
      <div class="col-span-2">Product</div>
      <div class="col-span-2">Reference</div>
      <div class="col-span-1 text-center">Date</div>
      <div class="col-span-1 text-center">Status</div>
      <div class="col-span-2 text-center">Amount</div>
      <div class="col-span-2 text-center">Bill Purpose</div>
      <div class="col-span-2 text-center">Download</div>
    </div>

    <!-- Data Rows (this should scroll when there are many invoices) -->
    <div class="overflow-y-auto max-h-80"> <!-- Add scroll if there are many invoices -->
      <div
        v-for="(invoice, index) in invoices"
        :key="index"
        class="grid grid-cols-12 gap-0 md:gap-4 text-xs sm:text-sm text-black-2 items-center py-4 border-b border-black-2"
      >
        <div class="col-span-2 font-medium">{{ invoice.product }}</div>
        <div class="col-span-2 truncate">{{ invoice.transactionId }}</div>
        <div class="col-span-1">{{ formatDate(invoice.billingTime) }}</div>
        <div class="col-span-1 text-center">{{ invoice.STATUS }}</div>
        <div class="col-span-2 text-center font-medium">{{ invoice.AMOUNT }} USD</div>
        <div class="col-span-2 text-center font-medium">{{ invoice.billingReason }}</div>
        <div class="col-span-2 flex justify-center">
          <a
            href="javascript:void(0);"
            @click="handleDownload(invoice.receiptUrl)"
            download
            class="text-blue-600 hover:text-blue-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 00-1 1v7H6a1 1 0 00-.707 1.707l4 4a1 1 0 001.414 0l4-4A1 1 0 0014 11h-3V4a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
              <path
                d="M3 16a2 2 0 002 2h10a2 2 0 002-2v-1a1 1 0 112 0v1a4 4 0 01-4 4H5a4 4 0 01-4-4v-1a1 1 0 112 0v1z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import genAiService from '@/services/gen-ai';

// State to hold the invoice data
const invoices = ref([]);

// Fetch invoices data from API
const fetchInvoices = async () => {
  try {
    const response = await genAiService.fetchPaymentInfo() // Replace with your API endpoint
    invoices.value = response.data
    console.log('Invoices fetched successfully:', invoices.value)
  } catch (error) {
    console.error('Error fetching invoices:', error)
  }
}
const handleDownload = (url) => {
  const newTab = window.open(url, '_blank', 'noopener,noreferrer')
  if (newTab) {
    newTab.onload = () => {
      const link = document.createElement('a')
      link.href = url
      link.download = '' // Add a filename if necessary
      link.click()
      newTab.close() // Close the tab after download
    }
  } else {
    console.error('Failed to open the link in a new tab.')
  }
  // Ensure the URL is downloadable
}

const isInvoiceVisible = ref(true); // Controls the visibility of the invoice

const closeInvoice = () => {
  isInvoiceVisible.value = false; // Close the invoice when clicking outside
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
// Fetch data when the component is mounted
onMounted(fetchInvoices);
</script>

