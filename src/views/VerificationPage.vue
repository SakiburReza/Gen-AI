<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import genAiService from '@/services/gen-ai';
import { useToastStore } from '@/stores/toast';
import { FwbSpinner } from 'flowbite-vue';

const toastStore = useToastStore();
const router = useRouter();
const route = useRoute();
const email = route.query.email;

// Refs
const otpCode = ref('');
const loading = ref(false);
const timer = ref(120); // Timer in seconds (5 minutes)
const resendVisible = ref(false);

// Function to format time as mm:ss
const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timer.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// Start the timer
const startTimer = () => {
  resendVisible.value = false;
  timer.value = 120; // Reset to 5 minutes
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      clearInterval(interval);
      resendVisible.value = true; // Show Resend Code
    }
  }, 1000);
};

// Resend Code handler
const handleResendCode = async () => {
  try {
    // Simulate API call for resending the OTP
    await genAiService.resendOTP(email);
    toastStore.success("OTP has been resent.");
    startTimer(); // Restart the timer
  } catch (error) {
    toastStore.error("Failed to resend OTP. Please try again.");
  }
};

// Handle OTP submission
const handleSubmit = async () => {
  if (!otpCode.value) {
    toastStore.error("Enter your OTP");
    return;
  }

  loading.value = true;
  try {
    const response = await genAiService.checkOTP(email, otpCode.value);
    if (response.status) {
      router.push("/");
    } else {
      toastStore.error(response.data.message || "Invalid OTP");
    }
  } catch (error) {
    toastStore.error("An error occurred. Please try again.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  startTimer(); // Start the timer when the component mounts
});
</script>


<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-300 px-4">


    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/images/BG.jpg" alt="Background Image" class="w-full h-full object-cover" />
    </div>

    <div class="absolute top-4 inset-x-0 flex justify-center z-10">
      <img src="/images/zeuxis-logo.png" alt="Flowbite logo" class="w-40 h-4" />
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

        <div class="flex items-center justify-between">

          <!-- Timer -->

          <span class="w-22 py-2.5  rounded-lg font-bold transition duration-300 flex items-center justify-center text-black-2">{{ formattedTime }}</span>


          <!-- Resend Code -->

          <button

            v-if="resendVisible"

            @click="handleResendCode"

            class="text-sm text-blue-600 hover:underline">

            Resend Code

          </button>

        </div>

        <button
          @click="handleSubmit"
          type="submit"
          class="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
          <!-- Spinner inside the button -->
          <fwb-spinner v-if="loading" size="12" class="mr-2 bg-black" />
          <span v-if="!loading">Submit</span>
        </button>
      </div>
    </div>
  </div>
</template>
