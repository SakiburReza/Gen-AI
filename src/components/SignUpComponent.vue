<script setup>
import { ref } from 'vue'
import genAiService from '@/services/gen-ai'

// Reactive form data object
const formData = ref({
  name: '',
  email: '',
  password: '',
})

// Form submission handler
const submitForm = async () => {
  // Create a new object excluding termsAccepted from the payload
  const { termsAccepted, ...formPayload } = formData.value
  
  console.log(formPayload) // Check form data without termsAccepted
  try {
    const { data: response } = await genAiService.register(formPayload)
    console.log('Form submission successful:', response)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
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
        <h2 class="text-2xl font-bold mb-3 text-center text-gray-800">Sign Up</h2>

        <!-- Social Buttons -->
        <!-- <button
          class="w-full flex items-center justify-center mb-4 p-3 bg-black text-white rounded-full hover:bg-opacity-80 transition"
          aria-label="Sign Up with Apple"
        >
          <img src="/public/images/icon/apple-icon.svg" alt="Apple Icon" class="w-5 h-5 mr-2" />
          Sign Up with Apple
        </button>
        <button
          class="w-full flex items-center justify-center mb-6 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          aria-label="Sign Up with Google"
        >
          <img src="/public/images/icon/google-icon.svg" alt="Google Icon" class="w-5 h-5 mr-2" />
          Sign Up with Google
        </button> -->

        <!-- Sign-Up Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Full Name"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="formData.email"
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
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
              aria-label="Password"
              required
            />
          </div>

          <!-- Checkbox -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="agree"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Accept Terms"
              required
            />
            <label for="agree" class="ml-2 text-sm text-gray-600">
              I agree to all statements in the terms of service.
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
              aria-label="Sign Up"
            >
              Sign Up
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <p class="text-sm text-gray-600 text-center mt-4">
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
