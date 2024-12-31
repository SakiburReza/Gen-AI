<script setup>
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import genAiService from '@/services/gen-ai'
import { useRouter } from 'vue-router'

const router = useRouter()

const toastStore = useToastStore()
// Reactive form inputs
const username = ref('')
const password = ref('')

// Form submission handler
const submitForm = async () => {
  try {
    // Prepare the user data for the sign-in request
    const data = { username: username.value, password: password.value }

    // Make the API call to the sign-in endpoint
    const response = await genAiService.logIn(data)
    console.log(response)

    // Assuming the response contains a token or status indicating success
    if (response.data.status) {
      //toastStore.success('Sign-In successful')
      localStorage.setItem('authToken', response.data.data.token)
      router.push('/operativepage');
    } else {
      // Handle the case when the response doesn't indicate success
      //toastStore.error("Sign-In failed, please try again.");
    }
  } catch (error) {
    console.error('Sign-In failed:', error)
    // Handle the error (e.g., show error message)
    toastStore.error('An error occurred during sign-in.')
  }
}
</script>

<template>

  <div class="relative w-full h-screen overflow-hidden">

    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/images/BG.jpg" alt="Background Image" class="w-full h-full object-cover" />
    </div>

    <!-- Logo -->
    <div class="relative flex flex-col items-center justify-center  top-1">
      <img src="/images/zeuxis.png" alt="Flowbite logo" class="w-30 h-23" />
    </div>


    <div class="flex justify-center items-center min-h-screen relative z-10 ">
      <!-- Left Side - Image and Text -->
      <div class="relative lg:w-1/4 hidden sm:flex justify-center h-full items-center">
        <!-- Background Image with Overlay -->
        <img src="/public/images/Rectangle.png" alt="Background Image" class="w-full h-full object-cover" />

        <!-- Overlay Content -->
        <div class="absolute inset-0 flex flex-col p-6 bg-lightGray">
          <h1 class="md:text-2xl lg:text-3xl font-bold leading-tight text-black">
            CREATE <span class="text-blue-400">IMAGES</span> AND THEN TURN THOSE INTO
            <span class="text-blue-400">VIDEOS</span> IN <span class="text-blue-400">SECONDS</span>.
          </h1>
        </div>

        <!-- Secondary Display Image -->
        <img src="/public/images/slides.png" alt="Secondary Display Image" class="absolute bottom-0 left-0 w-full" />
      </div>

      <!-- Right Side - Sign-In Form -->
      <div class="lg:w-1/4 flex flex-col justify-center items-center px-4 h-full bg-white"> <br>
        <!-- Form Container -->
        <div class="w-full max-w-md ">
          <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

          <!-- Sign-In Form -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" v-model="username" type="email" placeholder="Enter your email"
                class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
                aria-label="Email" required />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" v-model="password" type="password" placeholder="Enter your password"
                class="w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 p-2 transition"
                aria-label="Password" required />
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center">
              <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                aria-label="Sign In">
                Sign In
              </button>
            </div>
          </form>

          <!-- Register Link -->
          <p class="text-sm text-gray-600 text-center mt-4">
            Don't have an account yet?
            <router-link to="/sign-up" class="text-blue-600 hover:underline">Sign Up</router-link>
          </p>
          <br>
        </div>
      </div>
    </div>
  </div>
</template>

