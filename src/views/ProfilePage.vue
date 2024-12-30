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
          <div class="relative mt-1">
            <!-- Input Field -->
            <input
              type="text"
              id="name"
              v-model="profile.name"
              class="block w-full rounded-md border-gray-300 bg-gray-100 p-2 pr-10"
              placeholder="Enter your name"
            />
            <!-- SVG Icon -->
            <svg
              width="24"
              height="26"
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
          <label for="email" class="block text-sm font-medium text-black-2">
            Account Email
          </label>
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
              width="24"
              height="18"
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
          <label for="password" class="block text-sm font-medium text-black-2">
            Password
          </label>
          <div class="relative mt-1">
            <!-- Input Field -->
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              id="password"
              v-model="profile.password"
              class="block w-full rounded-md border-gray-300 bg-gray-100 p-2 pr-10"
              placeholder="Enter your password"
            />
            <!-- SVG Icon for Toggle -->
            <svg
              v-if="isPasswordVisible"
              @click="togglePasswordVisibility"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 right-2 my-auto cursor-pointer"
              width="24"
              height="18"
              viewBox="0 0 24 18"
              fill="none"
            >
              <path
                d="M19.2995 15.7133L4.68409 1.09832L4.68097 1.09475C4.60184 1.01627 4.50803 0.954139 4.40489 0.911911C4.30176 0.869684 4.19131 0.848184 4.07986 0.84864C3.96842 0.849096 3.85815 0.871499 3.75536 0.914568C3.65258 0.957638 3.55928 1.02053 3.48079 1.09966C3.40231 1.17879 3.34018 1.2726 3.29796 1.37573C3.25573 1.47887 3.23423 1.58932 3.23468 1.70076C3.23561 1.92584 3.3259 2.14133 3.4857 2.29983L4.76532 3.57945C3.21349 4.64227 1.87775 5.99028 0.829164 7.55177C0.657931 7.80458 0.566406 8.10292 0.566406 8.40827C0.566406 8.71361 0.657931 9.01195 0.829164 9.26477C3.50579 13.2264 7.74902 15.5473 11.9923 15.5183C13.3667 15.5232 14.732 15.2944 16.0297 14.8416L18.1011 16.913C18.2607 17.0675 18.4745 17.1531 18.6966 17.1516C18.9187 17.1501 19.1313 17.0615 19.2888 16.9049C19.4463 16.7483 19.5361 16.5362 19.5388 16.3141C19.5416 16.0921 19.4571 15.8778 19.3035 15.7173L19.2995 15.7133ZM11.9923 13.2148C11.1883 13.2145 10.3973 13.0127 9.69144 12.6279C8.9856 12.2431 8.38744 11.6875 7.95164 11.012C7.51585 10.3364 7.25631 9.5624 7.19674 8.76068C7.13717 7.95896 7.27948 7.1551 7.61066 6.42256L8.94741 7.75931C8.83974 8.26669 8.86054 8.79293 9.00794 9.29023C9.15533 9.78753 9.42465 10.2401 9.79141 10.6069C10.1582 10.9736 10.6108 11.243 11.1081 11.3904C11.6054 11.5377 12.1316 11.5586 12.639 11.4509L13.9757 12.7876C13.3527 13.0701 12.6763 13.2158 11.9923 13.2148Z"
                fill="#6D6D6D"
              />
              <path
                d="M23.1576 7.54994C20.481 3.5861 16.2377 1.2652 11.9945 1.29421C10.6201 1.28924 9.25477 1.51804 7.95703 1.97085L10.0101 4.02395C10.901 3.62078 11.8937 3.49869 12.8557 3.67397C13.8178 3.84925 14.7036 4.31356 15.395 5.00503C16.0865 5.6965 16.5508 6.58229 16.7261 7.54434C16.9014 8.50639 16.7793 9.49901 16.3761 10.3899L19.221 13.2348C20.7731 12.1722 22.109 10.8241 23.1576 9.26249C23.3287 9.00972 23.4202 8.71147 23.4202 8.40621C23.4202 8.10096 23.3287 7.80271 23.1576 7.54994Z"
                fill="#6D6D6D"
              />
              <path
                d="M11.9924 5.29346C11.7751 5.29348 11.5583 5.31622 11.3457 5.3613L15.0373 9.05243C15.1335 8.59891 15.1273 8.12963 15.0189 7.67885C14.9106 7.22806 14.703 6.80717 14.4112 6.44692C14.1193 6.08667 13.7507 5.79615 13.3323 5.59658C12.9138 5.39702 12.456 5.29346 11.9924 5.29346Z"
                fill="#6D6D6D"
              />
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
                d="M19.2995 15.7133L4.68409 1.09832L4.68097 1.09475C4.60184 1.01627 4.50803 0.954139 4.40489 0.911911C4.30176 0.869684 4.19131 0.848184 4.07986 0.84864C3.96842 0.849096 3.85815 0.871499 3.75536 0.914568C3.65258 0.957638 3.55928 1.02053 3.48079 1.09966C3.40231 1.17879 3.34018 1.2726 3.29796 1.37573C3.25573 1.47887 3.23423 1.58932 3.23468 1.70076C3.23561 1.92584 3.3259 2.14133 3.4857 2.29983L4.76532 3.57945C3.21349 4.64227 1.87775 5.99028 0.829164 7.55177C0.657931 7.80458 0.566406 8.10292 0.566406 8.40827C0.566406 8.71361 0.657931 9.01195 0.829164 9.26477C3.50579 13.2264 7.74902 15.5473 11.9923 15.5183C13.3667 15.5232 14.732 15.2944 16.0297 14.8416L18.1011 16.913C18.2607 17.0675 18.4745 17.1531 18.6966 17.1516C18.9187 17.1501 19.1313 17.0615 19.2888 16.9049C19.4463 16.7483 19.5361 16.5362 19.5388 16.3141C19.5416 16.0921 19.4571 15.8778 19.3035 15.7173L19.2995 15.7133ZM11.9923 13.2148C11.1883 13.2145 10.3973 13.0127 9.69144 12.6279C8.9856 12.2431 8.38744 11.6875 7.95164 11.012C7.51585 10.3364 7.25631 9.5624 7.19674 8.76068C7.13717 7.95896 7.27948 7.1551 7.61066 6.42256L8.94741 7.75931C8.83974 8.26669 8.86054 8.79293 9.00794 9.29023C9.15533 9.78753 9.42465 10.2401 9.79141 10.6069C10.1582 10.9736 10.6108 11.243 11.1081 11.3904C11.6054 11.5377 12.1316 11.5586 12.639 11.4509L13.9757 12.7876C13.3527 13.0701 12.6763 13.2158 11.9923 13.2148Z"
                fill="#6D6D6D"
              />
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

const isPasswordVisible = ref(false);

const fetchUserProfile = async () => {
  try {
    const response = await genAiService.fetchUserProfile();
    if (response.data.status) {
      profile.value.name = response.data.data.userProfile.name;
      profile.value.email = response.data.data.userProfile.email;
      profile.value.logoPreview = response.data.data.profilePicture
    } else {
      console.error("Invalid response structure:", response);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// Password visibility toggle method
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Upload logo method
const uploadLogo = (event) => {
  const file = event.target.files[0];

  // Validate file existence
  if (!file) {
    return;
  }

  // Validate file type
  if (!file.type.match("image/png") && !file.type.match("image/jpeg") && !file.type.match("image/jpg")) {
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
      toastStore.error(img?.data.message)
    }
  };
  img.onerror = () => {
    toastStore.error(img?.data.message)
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
