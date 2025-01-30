<template>
  <div
    class="bg-white min-h-screen p-4 sm:p-6 lg:p-8"
    style="
      background-image: url('/images/BG.jpg');
      background-size: cover;
      background-position: left;
    "
  >
    <Navbar />

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

    <!-- Profile Form -->
    <div
      class="max-w-2xl mx-auto p-4 sm:p-6 bg-white border border-b-gray-400 shadow-md rounded-md mt-8"
    >
      <h2 class="text-2xl font-bold mb-8 text-black-2">Manage Profile</h2>

      <form @submit.prevent="saveProfile" class="mt-6">
        <!-- Profile Picture Section -->
        <h5 class="text-xl mb-6 text-black-2">Profile Picture</h5>
        <div class="flex items-center flex-wrap sm:flex-nowrap">
          <div class="relative">
            <img
              v-if="profile.logoPreview"
              :src="profile.logoPreview"
              alt="Profile Picture"
              class="h-30 w-30 rounded-full object-cover"
            />
            <div
              v-else
              class="bg-gray-300 h-30 w-30 rounded-full flex items-center justify-center text-6xl font-bold text-black-2"
            >
              H
            </div>
          </div>
          <div class="ml-4 flex flex-col mt-4 sm:mt-0">
            <label
              for="upload-photo"
              class="mt-2 px-7 py-1.5 bg-gray-300 text-black-2 rounded-md hover:bg-gray-400 cursor-pointer"
            >
              Upload Photo
            </label>
            <p class="text-xs text-black-2 mt-1">Min. 200x200px, PNG or JPG</p>
            <input
              id="upload-photo"
              type="file"
              accept="image/png, image/jpeg"
              class="hidden"
              @change="uploadLogo"
            />
          </div>
        </div>

        <!-- Account Name -->
        <div class="mb-4 mt-8">
          <label for="name" class="block text-sm font-medium text-black-2"> Account Name </label>
          <div class="relative mt-1">
            <!-- Input Field -->
            <input
              type="text"
              id="name"
              v-model="profile.name"
              class="block w-full rounded-md border-gray-300 bg-gray-100 p-2 pr-10"
              placeholder="Enter your name"
              required
            />
            <!-- SVG Icon -->
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

        <!-- Account Email -->
        <div class="mb-4 mt-8">
          <label for="email" class="block text-sm font-medium text-black-2"> Account Email </label>
          <div class="relative mt-1">
            <!-- Input Field -->
            <input
              type="email"
              id="email"
              v-model="profile.email"
              class="block w-full rounded-md border-gray-300 bg-gray-100 p-2 pr-10"
              placeholder="Enter your email"
              readonly
            />
            <!-- SVG Icon -->
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

        <!-- Password -->
        <div class="mb-4 mt-8">
          <label for="password" class="block text-sm font-medium text-black-2">New Password </label>
          <div class="relative mt-1">
            <!-- Input Field -->
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              id="password"
              v-model="profile.password"
              class="block w-full rounded-md border-gray-300 bg-gray-100 p-2 pr-10"
              placeholder="Enter your new password"
            />
            <!-- SVG Icon for Toggle -->
            <svg
              v-if="!isPasswordVisible"
              @click="togglePasswordVisibility"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 right-2 my-auto cursor-pointer"
              width="26"
              height="20"
              viewBox="0 0 24 18"
              fill="none"
            >
              <path
                d="M11.99 3C7.03 3 3 8 3 8s4.03 5 8.99 5c4.96 0 9-5 9-5s-4.03-5-8.99-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5S10.06 4.5 11.99 4.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"
                fill="#6D6D6D"
              />
              <circle cx="11.99" cy="8" r="1.5" fill="#6D6D6D" />
            </svg>
            <svg
              v-else
              @click="togglePasswordVisibility"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 right-2 my-auto cursor-pointer"
              width="24"
              height="18"
              viewBox="0 0 24 18"
              fill="none"
            >
              <path
                d="M11.99 3C7.03 3 3 8 3 8s4.03 5 8.99 5c4.96 0 9-5 9-5s-4.03-5-8.99-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5S10.06 4.5 11.99 4.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"
                fill="#6D6D6D"
              />
              <line x1="3" y1="3" x2="21" y2="15" stroke="#6D6D6D" stroke-width="2" />
            </svg>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <button
            type="button"
            @click="cancelChanges"
            class="px-3 py-2 bg-gray-300 text-black-2 rounded-md hover:bg-gray-400"
          >
            Clear
          </button>
          <button
            type="submit"
            :disabled="isSaveDisabled"
            :class="{
              'bg-blue-900 cursor-not-allowed': isSaveDisabled,
              'bg-blue-600 hover:bg-blue-700': !isSaveDisabled,
            }"
            class="px-5 py-2 text-white rounded-md transition duration-200"
          >
            Save
          </button>
          <button
            type="button"
            @click="deleteAccount"
            class="cursor-not-allowed px-7 py-2 bg-red text-white rounded-md hover:bg-red"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/NavBar.vue'
import genAiService from '@/services/gen-ai'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

const router = useRouter()
const toastStore = useToastStore()

// Reactive profile data
const profile = ref({
  name: '',
  email: '',
  password: '',
  logo: null,
  logoPreview: '',
})

// Store original profile data for change detection
const originalProfile = ref({
  name: '',
  password: '',
  logo: null,
})

// Track password visibility
const isPasswordVisible = ref(false)

// Fetch user profile from API
const fetchUserProfile = async () => {
  try {
    const response = await genAiService.fetchUserProfile()
    if (response.data.status) {
      profile.value.name = response.data.data.userProfile.name
      profile.value.email = response.data.data.userProfile.email
      profile.value.logoPreview = response.data.data.profilePicture

      // Store original values for change detection
      originalProfile.value.name = profile.value.name
      originalProfile.value.password = '' // Password should be empty initially
      originalProfile.value.logo = profile.value.logoPreview
    } else {
      console.error('Invalid response structure:', response)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Computed property: Enable save button only if any changes are detected
const isSaveDisabled = computed(() => {
  return (
    profile.value.name === originalProfile.value.name &&
    profile.value.password === originalProfile.value.password &&
    profile.value.logoPreview === originalProfile.value.logo
  )
})

// Watcher: Automatically disable Save button when no changes are made
watch([profile, () => profile.value.logoPreview], () => {
  console.log('Changes detected: Save button state updated')
})

// Toggle password visibility
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

// Upload and validate logo
const uploadLogo = (event) => {
  const file = event.target.files[0]

  if (!file) return

  if (
    !file.type.match('image/png') &&
    !file.type.match('image/jpeg') &&
    !file.type.match('image/jpg')
  ) {
    toastStore.error('Invalid file format. Please upload a PNG or JPEG.')
    return
  }

  const img = new Image()
  img.src = URL.createObjectURL(file)
  img.onload = () => {
    if (img.width >= 200 && img.height >= 200) {
      profile.value.logo = file
      profile.value.logoPreview = img.src
      console.log('Logo uploaded:', file.name)
    } else {
      toastStore.error('Image must be at least 200x200 pixels.')
    }
  }
  img.onerror = () => {
    toastStore.error('Invalid image file.')
  }
}

// Save profile
const saveProfile = async () => {
  if (isSaveDisabled.value) {
    console.log('No changes detected, skipping save.')
    return
  }

  try {
    console.log('Saving profile:', profile.value.name)

    const formData = new FormData()
    formData.append(
      'userProfileInfo',
      JSON.stringify({
        name: profile.value.name,
        email: profile.value.email,
        password: profile.value.password || null,
      }),
    )

    // Handle the case where the profile picture is cleared
    if (profile.value.logo) {
      // If a new logo is uploaded
      console.log('Uploading logo:', profile.value.logo.name)
      formData.append('profilePicture', profile.value.logo, profile.value.logo.name)
    } else if (profile.value.logoPreview === '') {
      // If logo was cleared, send an empty string to the backend
      console.log('Clearing logo, sending empty value.')
      formData.append('profilePicture', '')
    }

    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    const response = await genAiService.saveProfile(formData)

    if (response?.data?.status) {
      toastStore.success(response.data.message)

      // Update original profile values after successful save
      originalProfile.value.name = profile.value.name
      originalProfile.value.password = ''
      originalProfile.value.logo = profile.value.logoPreview
    } else {
      console.error('Unexpected response format:', response)
      toastStore.error('Failed to update profile. Please try again.')
    }
  } catch (error) {
    console.error('Error saving user profile:', error)
    toastStore.error('An error occurred while saving your profile.')
  }
}



// Reset changes
const cancelChanges = () => {
  profile.value.name = "";
  profile.value.password = "";
  profile.value.logo = null;
  profile.value.logoPreview = null;
}

// Delete account confirmation
const deleteAccount = () => {
  //logic will be set here
}

// Navigate back to previous page
const goBack = () => {
  localStorage.setItem('selectedMenu', 'home')
  router.push('/operativepage')
}

// Load profile data when component mounts
onMounted(fetchUserProfile)
</script>
