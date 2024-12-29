<template>
  <div class="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-4xl mx-auto bg-white border rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
      <h2 class="text-lg font-semibold text-black-2 mb-4">Invoices</h2>

      <!-- Header Row -->
      <div
        class="grid grid-cols-6 gap-2 text-xs sm:text-sm font-medium text-black-2 border-b border-black-2 pb-4"
      >
        <div class="col-span-2 sm:col-span-1">Product</div>
        <div class="col-span-2 sm:col-span-1">Reference</div>
        <div class="col-span-2 sm:col-span-1 ml-4">Date</div>
        <div class="hidden sm:block text-center">Status</div>
        <div class="hidden sm:block text-center">Amount</div>
        <div class="hidden sm:block text-center">Download</div>
      </div>

      <!-- Data Rows -->
      <div
        v-for="(invoice, index) in invoices"
        :key="index"
        class="grid grid-cols-6 gap-2 text-xs sm:text-sm text-black-2 items-center py-3 border-b border-black-2"
      >
        <div class="col-span-2 sm:col-span-1">{{ invoice.product }}</div>
        <div class="col-span-2 sm:col-span-1 truncate">{{ invoice.transactionId }}</div>
        <div class="col-span-2 sm:col-span-1 ml-4">{{ formatDate(invoice.billingTime) }}</div>
        <div class="hidden sm:block text-center">{{ invoice.STATUS }}</div>
        <div class="hidden sm:block text-center ml-4">{{ invoice.AMOUNT }} USD</div>
        <div class="hidden sm:flex justify-center">
          <a
            :href="invoice.receiptUrl"
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
    const response = await genAiService.fetchPaymentInfo(); // Replace with your API endpoint
    invoices.value = response.data;
    console.log('Invoices fetched successfully:', invoices.value);
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
};

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const downloadInvoice = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice: ${response.statusText}`);
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.pdf`; // Add .pdf or desired file extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading invoice:', error);
  }
};


// Fetch data when the component is mounted
onMounted(fetchInvoices);
</script>

