<template>
  <Navbar />
  <div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">

    <!-- Back Button -->
    <div class="absolute top-10 left-4 md:left-10 lg:left-20">
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

      <!-- Profile Picture Section -->
      <h5 class="text-xl mb-6 text-black-2">Profile Picture</h5>
      <div class="flex items-center flex-wrap sm:flex-nowrap">
        <div class="relative">
          <img
            v-if="profile.logoPreview"
            :src="profile.logoPreview"
            alt="Profile Picture"
            class="h-20 w-20 rounded-full object-cover"
          />
          <div
            v-else
            class="bg-gray-300 h-20 w-20 rounded-full flex items-center justify-center text-4xl font-bold text-black-2"
          >
            H
          </div>
        </div>
        <div class="ml-4 flex flex-col mt-4 sm:mt-0">
          <label
            for="upload-photo"
            class="mt-2 px-4 py-2 bg-gray-300 text-black-2 rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Upload Photo
          </label>
          <p class="text-xs text-black-2 mt-1">
            Min. 200x200px, PNG or JPG
          </p>
          <input
            id="upload-photo"
            type="file"
            accept="image/png, image/jpeg"
            class="hidden"
            @change="uploadLogo"
          />
        </div>
      </div>


      <form @submit.prevent="saveProfile" class="mt-6">
        <!-- Account Name -->
        <div class="mb-4">
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

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "ManageProfile",
  components: {
    Navbar,
  },
  data() {
    return {
      profile: {
        name: "Henrique Baffi",
        email: "Henrique@zeuxistalent.com",
        password: "*****************",
        logo: null,
        logoPreview: null,
      },
    };
  },
  methods: {
    uploadLogo(event) {
      const file = event.target.files[0];
      if (!file) return alert("No file selected!");

      // Validate file type and dimensions
      if (!file.type.match("image/png") && !file.type.match("image/jpeg")) {
        return alert("Please upload a PNG or JPG image.");
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width >= 200 && img.height >= 200) {
          this.profile.logo = file;
          this.profile.logoPreview = img.src;
        } else {
          alert("Image must be at least 200x200 pixels.");
        }
      };
    },
    saveProfile() {
      alert("Profile saved successfully!");
    },
    cancelChanges() {
      this.profile = {
        name: "",
        email: "",
        password: "",
        logo: null,
        logoPreview: null,
      };
    },
    deleteAccount() {
      if (confirm("Are you sure you want to delete your account?")) {
        alert("Account deleted successfully.");
      }
    },
    goBack() {
      window.location.href = "http://localhost:3000/";
    },
  },
};
</script>
