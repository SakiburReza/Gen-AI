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
    <div class="relative lg:w-1/4 hidden sm:flex justify-center h-full items-center">
      <!-- Background Image with Overlay -->
      <img
        src="/public/images/Rectangle.png"
        alt="Background Image"
        class="w-full h-full object-cover"
      />

      <!-- Overlay Content -->
      <div class="absolute inset-0 flex flex-col p-6">
        <h1 class="md:text-2xl lg:text-3xl font-bold leading-tight text-black">
          CREATE <span class="text-blue-400">IMAGES</span> AND THEN TURN THOSE INTO
          <span class="text-blue-400">VIDEOS</span> IN <span class="text-blue-400">SECONDS</span>.
        </h1>
      </div>

      <!-- Secondary Display Image -->
      <img
        src="/public/images/slides.png"
        alt="Secondary Display Image"
        class="absolute bottom-0 left-0 w-full"
      />
    </div>

   <!-- Right Side - Sign-Up Form -->
<div class="lg:w-1/4 flex flex-col justify-center items-center px-4 h-full">
  <!-- Form Container -->
  <div class="w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

    <!-- Social Buttons -->
    <button
      class="w-full flex items-center justify-center mb-4 p-3 bg-black text-white rounded-full hover:bg-opacity-80 transition"
      aria-label="Sign in with Apple"
    >
      <img src="/public/images/icon/apple-icon.svg" alt="Apple Icon" class="w-5 h-5 mr-2" />
      Sign in with Apple
    </button>
    <button
      class="w-full flex items-center justify-center mb-6 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      aria-label="Sign in with Google"
    >
      <img src="/public/images/icon/google-icon.svg" alt="Google Icon" class="w-5 h-5 mr-2" />
      Sign in with Google
    </button>

    <!-- Sign-Up Form -->
    <form @submit.prevent="submitForm" class="space-y-6">

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
          aria-label="Email"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
          aria-label="Password"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          aria-label="Sign In"
        >
          Sign In
        </button>
      </div>
    </form>
  </div>
</div>

  </div>
</template>

<style>
/* Optional custom styles */
</style>
