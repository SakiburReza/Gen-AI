<script setup>
import { ref } from 'vue'

// Reactive form inputs
const fullName = ref('')
const email = ref('')
const password = ref('')
const termsAccepted = ref(false)

// Form submission handler
const submitForm = () => {
  console.log({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    termsAccepted: termsAccepted.value,
  })
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <!-- Left Side - Image and Text -->
    <div class="relative lg:w-1/4 flex justify-center items-center">
      <!-- Background Image -->
      <div class="relative">
        <img
          src="/public/images/Rectangle.png"
          alt="Background Image"
          class="w-full h-full object-cover"
        />

        <!-- Top Text -->
        <div class="absolute inset-0 justify-center items-center p-4">
          <h1 class="text-2xl font-bold leading-tight text-gray-800 p-10">
            CREATE <span class="text-blue-600">IMAGES</span> AND THEN TURN THOSE INTO
            <span class="text-blue-600">VIDEOS</span> IN <span class="text-blue-600">SECONDS</span>.
          </h1>
        </div>

        <!-- Image Below the Text (Positioned at Bottom-Left) -->
        <img
          src="/public/images/slides.png"
          alt="Secondary Display Image"
          class="absolute bottom-0 left-0"
        />
      </div>
    </div>

    <!-- Right Side - Sign-Up Form -->
    <div class="lg:w-1/4 flex flex-col justify-center items-center">
      <!-- Form Container -->
      <div class="w-full max-w-md md:ml-5">
        <h2 class="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <!-- Social Buttons -->
        <button
          class="w-full flex items-center justify-center mb-4 p-3 bg-black text-white rounded-full hover:opacity-90"
        >
          <img src="/public/images/icon/apple-icon.svg" alt="Apple Icon" class="w-5 h-5 mr-2" />
          Sign in with Apple
        </button>
        <button
          class="w-full flex items-center justify-center mb-6 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <img src="/public/images/icon/google-icon.svg" alt="Google Icon" class="w-5 h-5 mr-2" />
          Sign in with Google
        </button>

        <!-- Sign-Up Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- FULL NAME -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">FULL NAME</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
              class="w-full border-0 border-b-2 border-black focus:outline-none focus:ring-0 p-2"
              required
            />
          </div>

          <!-- EMAIL -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">EMAIL</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full border-0 border-b-2 border-black focus:outline-none focus:ring-0 p-2"
              required
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">PASSWORD</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full border-0 border-b-2 border-black focus:outline-none focus:ring-0 p-2"
              required
            />
          </div>

          <!-- Checkbox -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="agree"
              v-model="termsAccepted"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label for="agree" class="ml-2 block text-sm text-gray-600">
              I agree to all statements in terms of service
            </label>
          </div>

          <!-- Submit Button - Aligned to the right -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-600"
            >
              SIGN IN
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <p class="text-sm text-black text-center mt-4">
          I'm already a member.
          <a href="#" class="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Optional custom styles */
</style>
