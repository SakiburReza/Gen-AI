<script setup>
import { ref } from 'vue';

// Ref to hold the OTP value
const otpCode = ref('');

// Function to handle submit
const handleSubmit = () => {
  if (!otpCode.value) {
    alert('Please enter the OTP');
    return;
  }
  // Simulating an API call
  console.log('Submitted OTP:', otpCode.value);
  alert('OTP Submitted!');
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/images/BG.jpg" alt="Background Image" class="w-full h-full object-cover" />
    </div>

    <!-- Card Container -->
    <div class="relative w-full max-w-lg bg-white mx-auto px-6 py-8 space-y-5 rounded-lg shadow-md border border-gray-400 z-10">
      <div class="text-center space-y-3">
        <p class="font-gordita font-bold text-xl sm:text-3xl">Verify Your Email</p>
        <p class="text-black-2">We sent an OTP to your email</p>
      </div>
      <div class="space-y-4">
        <input
          v-model="otpCode"
          type="text"
          class="input-icon w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your code"
        />
        <button
          @click="handleSubmit"
          type="submit"
          class="w-22 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>


