<template>
  <div class="bg-white min-h-screen p-4 sm:p-6 lg:p-8"
       style="background-image: url('/images/BG.jpg'); background-size: cover; background-position: left;">
    <Navbar/>

    <!-- Back Button -->
    <div
      class="flex items-center justify-center mt-4 sm:absolute sm:top-10 sm:left-4 md:left-10 lg:left-40 sm:mt-0"
    >
      <button
        @click="goBack"
        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-all"
      >
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>

    <!-- Feedback Form -->
    <div class="max-w-2xl mx-auto p-4 sm:p-6 bg-white border border-b-gray-400 shadow-md rounded-md mt-8">
      <h2 class="text-2xl font-bold mb-8 text-black-2">Feedback Form</h2>

      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-4">
          <label for="name" class="block text-sm text-black-2 font-medium mb-1">Name</label>
          <div class="relative">
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full bg-gray-100 border border-gray-300 rounded p-2 pr-10"
              placeholder="Enter name"
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 right-2 my-auto"
            >
              <path
                d="M11.9922 0C8.21208 0 5.13672 3.07536 5.13672 6.85547C5.13672 10.6356 8.21208 13.7109 11.9922 13.7109C15.7723 13.7109 18.8477 10.6356 18.8477 6.85547C18.8477 3.07536 15.7723 0 11.9922 0Z"
                fill="#6D6D6D"
              />
              <path
                d="M20.5217 18.1896C18.6448 16.2839 16.1567 15.2344 13.5156 15.2344H10.4688C7.82772 15.2344 5.33954 16.2839 3.46266 18.1896C1.59498 20.086 0.566406 22.5892 0.566406 25.2383C0.566406 25.659 0.907453 26 1.32812 26H22.6562C23.0769 26 23.418 25.659 23.418 25.2383C23.418 22.5892 22.3894 20.086 20.5217 18.1896Z"
                fill="#6D6D6D"
              />
            </svg>
          </div>
        </div>

        <!-- Question -->
        <div class="mb-4">
          <label for="question" class="block text-sm text-black-2 font-medium mb-1">Question</label>
          <div class="relative">
            <input
              type="text"
              id="question"
              v-model="form.question"
              class="w-full bg-gray-100 border border-gray-300 rounded p-2 pr-10"
              placeholder="Enter question"
              required
            />
            <svg
              class="absolute inset-y-0 right-3 w-5 h-5 text-gray-500 my-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 0.451904C4.47301 0.451904 0 4.9244 0 10.4519C0 15.9788 4.4725 20.4519 10 20.4519C15.527 20.4519 20 15.9794 20 10.4519C20 4.92491 15.5275 0.451904 10 0.451904ZM9.7041 15.1323C9.13809 15.1323 8.70371 14.6585 8.70371 14.1187C8.70371 13.5659 9.15125 13.1052 9.7041 13.1052C10.257 13.1052 10.7176 13.5659 10.7176 14.1188C10.7176 14.6584 10.2701 15.1323 9.7041 15.1323ZM11.2046 10.0119C10.4807 10.5779 10.4675 10.9728 10.4675 11.6573C10.4675 11.9074 10.3359 12.197 9.6909 12.197C9.15117 12.197 8.96695 11.9995 8.96695 11.3151C8.96695 10.183 9.46715 9.64335 9.84887 9.31429C10.2832 8.94569 11.0204 8.53769 11.0204 7.8269C11.0204 7.22136 10.4939 6.93179 9.8357 6.93179C8.49309 6.93179 8.7827 7.94538 8.07184 7.94538C7.71645 7.94538 7.28207 7.70839 7.28207 7.19507C7.28207 6.48429 8.09816 5.4312 9.87519 5.4312C11.56 5.4312 12.6789 6.36581 12.6789 7.60312C12.6789 8.84042 11.56 9.7355 11.2046 10.0119Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm text-black-2 font-medium mb-1">Email</label>
          <div class="relative">
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="w-full bg-gray-100 border border-gray-300 rounded p-2 pr-10"
              placeholder="Enter email"
              required
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 right-2 my-auto"
            >
              <path
                d="M15.3885 9.94946L13.4724 11.872C12.6954 12.6517 11.3283 12.6686 10.5345 11.872L8.61832 9.94946L1.73633 16.8538C1.9925 16.9723 2.27494 17.0429 2.57522 17.0429H21.4317C21.732 17.0429 22.0143 16.9723 22.2704 16.8538L15.3885 9.94946Z"
                fill="#6D6D6D"
              />
              <path
                d="M21.4316 0.957275H2.57513C2.27486 0.957275 1.99241 1.02796 1.73633 1.14642L9.09022 8.52471C9.09071 8.52521 9.0913 8.52529 9.09179 8.52579C9.09228 8.52628 9.09237 8.52695 9.09237 8.52695L11.4835 10.926C11.7375 11.18 12.2693 11.18 12.5233 10.926L14.914 8.52735C14.914 8.52735 14.9146 8.52628 14.915 8.52579C14.915 8.52579 14.9161 8.52521 14.9166 8.52471L22.2703 1.14638C22.0142 1.02788 21.7319 0.957275 21.4316 0.957275Z"
                fill="#6D6D6D"
              />
              <path
                d="M0.780262 2.0835C0.64773 2.35151 0.566406 2.64901 0.566406 2.9677V15.0323C0.566406 15.351 0.647641 15.6485 0.780217 15.9165L7.67414 9.00021L0.780262 2.0835Z"
                fill="#6D6D6D"
              />
              <path
                d="M23.2278 2.08325L16.334 9.00005L23.2278 15.9164C23.3603 15.6484 23.4417 15.3509 23.4417 15.0321V2.96754C23.4417 2.64877 23.3603 2.35126 23.2278 2.08325Z"
                fill="#6D6D6D"
              />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-4">
          <label for="message" class="block text-sm text-black-2 font-medium mb-1">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            class="w-full bg-gray-100 border border-gray-300 rounded p-2"
            placeholder="Enter message"
            rows="4"
            required
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-300 text-black-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/NavBar.vue'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import genAiService from '@/services/gen-ai'

const router = useRouter()
const toastStore = useToastStore()

// Define the form data object
const form = reactive({
  name: '',
  question: '',
  email: '',
  message: '',
})

// Reset the form to initial state
const resetForm = () => {
  form.name = ''
  form.question = ''
  form.email = ''
  form.message = ''
}

const submitForm = async () => {
  console.log('Form Submitted:', form)
  const FeedbackEmail = {
    name: form.name,
    question: form.question,
    email: form.email,
    message: form.message,
  }
  try {
    const response = await genAiService.saveFeedback(FeedbackEmail)

    console.log(response)
    if (response?.data.status) {
      toastStore.success(response?.data.message)
      //
    } else {
      console.error('Invalid response structure:', response)
    }
    // Reset form after submission
    resetForm()
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

const goBack = () => {
  router.push('/operativepage')
}
</script>
