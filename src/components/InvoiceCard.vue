<template>
  <div class="flex items-center justify-center min-h-screen p-6 sm:p-6 lg:p-6">
    <div class="w-full max-w-4xl mx-auto bg-white border rounded-lg shadow-md p-2 sm:p-6 lg:p-2">
      <h2 class="text-lg font-semibold text-black-2 mb-4">Invoices</h2>

      <!-- Header Row with underline -->
      <div
        class="grid grid-cols-6 gap-6 text-sm font-medium text-black-2 border-b border-black-2 pb-4"
      >
        <div class="col-span-1">Product</div>
        <div class="col-span-1">Reference</div>
        <div class="col-span-1 ml-4">Date</div>
        <div class="col-span-1 text-center">Status</div>
        <div class="col-span-1 text-center ml-2">Amount</div>
        <div class="col-span-1 text-center">Download</div>
      </div>

      <!-- Data Rows -->
      <div
        v-for="(invoice, index) in invoices"
        :key="index"
        class="grid grid-cols-6 gap-10 text-sm text-black-2 items-center py-3 border-b border-black-2 pb-4"
      >
        <div class="col-span-1 font-medium">{{ invoice.product }}</div>
        <div class="col-span-1 truncate">{{ invoice.transactionId }}</div>
        <div class="col-span-1 ml-2">{{ invoice.billingTime }}</div>
        <div class="col-span-1 text-center">{{ invoice.STATUS }}</div>
        <div class="col-span-1 text-center font-medium ml-2">{{ invoice.AMOUNT }} USD</div>
        <div class="col-span-1 flex justify-center">
          <a
            href="javascript:void(0);"
            @click="handleDownload(invoice.receiptUrl)"
            download
            class="text-blue-600 hover:text-blue-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
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

      <!-- Add spacing below the card -->
      <div class="mt-8"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import genAiService from '@/services/gen-ai'
// State to hold the invoice data
const invoices = ref([])

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
// Fetch data when the component is mounted
onMounted(fetchInvoices)
</script>
