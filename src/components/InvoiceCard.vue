<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md mx-auto bg-white border rounded-lg shadow-md p-4">
      <h2 class="text-lg font-semibold text-black-2 mb-4">Invoices</h2>

      <!-- Header Row with underline -->
      <div class="grid grid-cols-5 gap-2 text-sm font-medium text-black-2 border-b border-black-2 pb-2">
        <div class="col-span-1">Product</div>
        <div class="col-span-1">Reference</div>
        <div class="col-span-1">Date</div>
        <div class="col-span-1 text-center">Status</div>
        <div class="col-span-1 text-center">Download</div>
      </div>

      <!-- Data Row with underline and gap -->
      <div class="grid grid-cols-5 gap-2 text-sm text-black-2 items-center py-3 border-b border-black-2">
        <div class="col-span-1 font-medium">Premium</div>
        <div class="col-span-1 truncate">INV_C_2024-345678</div>
        <div class="col-span-1">Dec 11, 2024</div>
        <div class="col-span-1 flex justify-center">
          <input
            type="checkbox"
            class="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
            checked
          />
        </div>
        <div class="col-span-1 flex justify-center">
          <button
            @click="downloadInvoice"
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
          </button>
        </div>
      </div>

      <!-- Add spacing below the card -->
      <div class="mt-8"></div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const navigateTo = (url) => {
      console.log(`Navigating to: ${url}`);
      router.push(url);
    };

    return { navigateTo };
  },
};
</script>
