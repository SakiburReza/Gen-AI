<template>
  <Navbar />
  <div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
    <!-- Back Button -->
    <div class="absolute top-10 left-4 md:left-10 lg:left-40">
      <button
        @click="goBack"
        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-all"
      >
        TAKE ME BACK I WANT TO CREATE
      </button>
    </div>

    <!-- Profile Form -->

    <div class="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md mt-1">
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
          <label for="name" class="block text-sm font-medium text-black-2">
            Account Name
          </label>
          <input
            type="text"
            id="name"
            v-model="profile.name"
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2"
            placeholder="Enter your name"
          />
        </div>

        <!-- Account Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-black-2">
            Account Email
          </label>
          <input
            type="email"
            id="email"
            v-model="profile.email"
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2"
            placeholder="Enter your email"
            readonly
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-black-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            v-model="profile.password"
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2"
            placeholder="Enter your password"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <button
            type="button"
            @click="cancelChanges"
            class="px-3 py-2 bg-gray-300 text-black-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            @click="deleteAccount"
            class="px-7 py-2 bg-red text-white rounded-md hover:bg-red"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref,  onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";
import genAiService from "@/services/gen-ai";
import router from '@/router/index.js'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const profile = ref({
  name: "",
  email: "",
  password: "",
  logo: "",
  logoPreview: "",
});

const fetchUserProfile = async () => {
  try {
    const response = await genAiService.fetchUserProfile();
    if (response.data.status) {
      profile.value.name = response.data.data.userProfile.name;
      profile.value.email = response.data.data.userProfile.email;
    } else {
      console.error("Invalid response structure:", response);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};



// Upload logo method
const uploadLogo = (event) => {
  const file = event.target.files[0];

  // Validate file existence
  if (!file) {
    alert("No file selected!");
    return;
  }

  // Validate file type
  if (!file.type.match("image/png") && !file.type.match("image/jpeg")) {
    alert("Please upload a PNG or JPG image.");
    return;
  }

  // Validate dimensions
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    if (img.width >= 200 && img.height >= 200) {
      profile.value.logo = file;
      profile.value.logoPreview = img.src;
      console.log("Logo uploaded:", file.name);
    } else {
      alert("Image must be at least 200x200 pixels.");
    }
  };
  img.onerror = () => {
    alert("Invalid image file. Please try again.");
  };
};


const saveProfile = async () => {
  try {
    console.log(profile.value.name)
    const formData = new FormData()
    formData.append(
      'userProfileInfo',
      JSON.stringify({
        name: profile.value.name,
        email: null,
        password: profile.value.password != null ? profile.value.password : null,
      })
    )
    if (profile.value.logo) {
      console.log("Logo file:", profile.value.logo);
      formData.append("profilePicture", profile.value.logo, profile.value.logo.name);
    }
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
     const response = await genAiService.saveProfile(formData);
     console.log(response);
     if (response?.data.status) {
     toastStore.success(response?.data.message)
    //
    } else {
      console.error("Invalid response structure:", response);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const cancelChanges = () => {
  profile.value.name = "";
  profile.value.email = "";
  profile.value.password = "";
  profile.value.logo = null;
  profile.value.logoPreview = null;
};

const deleteAccount = () => {
  if (confirm("Are you sure you want to delete your account?")) {
    alert("Account deleted successfully.");
  }
};

const goBack = () => {
  router.push("/operativepage");
};

onMounted(fetchUserProfile);
</script>
