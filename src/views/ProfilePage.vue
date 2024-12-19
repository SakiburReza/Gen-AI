<template>
  <Navbar />
  <div class="bg-white md:grid md:grid-cols-2 items-center">
    <!-- First Column -->
    <div class="flex flex-col items-end justify-center bg-white p-6">
      <div class="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-6 text-black-2 text-left md:text-left">
          Manage Profile
        </h2>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile">
          <!-- Account Name -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-black-2">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              v-model="profile.name"
              placeholder="Enter your name"
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder:text-black-2"
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
              placeholder="Enter your email"
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder:text-black-2"
            />
          </div>

          <!-- Account Logo Upload -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-black-2">Account Logo</label>
            <div class="mt-1 flex items-center">
              <!-- Logo Preview -->
              <div
                v-if="profile.logoPreview"
                class="h-16 w-16 flex items-center justify-center bg-gray-300 rounded-md overflow-hidden"
              >
                <img
                  :src="profile.logoPreview"
                  alt="Uploaded Logo"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="h-16 w-16 flex items-center justify-center bg-gray-300 text-xl font-bold text-black-2 rounded-md"
              >
                H
              </div>

              <!-- Upload Button -->
              <label class="ml-4 flex items-center cursor-pointer">
      <span
        class="px-4 py-2 bg-gray-300 text-black-2 rounded-md hover:bg-gray-400 text-sm"
      >
        Upload Logo
      </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  @change="uploadLogo"
                  class="hidden"
                />
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Min. 200x200px, PNG or JPG
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-6">
            <button
              type="button"
              @click="cancelChanges"
              class="px-4 py-2 bg-gray-300 text-black-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>

        <!-- Delete Account Button -->
        <div class="flex justify-start mt-27">
          <button
            type="button"
            @click="deleteAccount"
            class="px-4 py-2 bg-red text-white rounded-md hover:bg-red"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Second Column -->
    <div class="flex flex-col items-center justify-center bg-white w-full p-6">
      <button
        @click="goBack"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        TAKE ME BACK I WANT TO CREATE
      </button>
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
        name: "",
        email: "",
        logo: null,
        logoPreview: null,
      },
    };
  },
  methods: {
    uploadLogo(event) {
      const file = event.target.files[0];

      // Step 1: Validate file existence
      if (!file) {
        alert("No file selected!");
        return;
      }

      // Step 2: Validate file type (PNG or JPG)
      if (!file.type.match("image/png") && !file.type.match("image/jpeg")) {
        alert("Please upload a PNG or JPG image.");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      // Step 3: Validate dimensions (Min: 200x200px)
      img.onload = () => {
        if (img.width >= 200 && img.height >= 200) {
          this.profile.logo = file;
          this.profile.logoPreview = img.src;
          console.log("Logo uploaded:", file.name);
        } else {
          alert("Image must be at least 200x200 pixels.");
        }
      };

      img.onerror = () => {
        alert("Invalid image file. Please try again.");
      };
    },
    saveProfile() {
      console.log("Profile saved:", this.profile);
      alert("Profile saved successfully!");
      // Here you can send the profile data to the backend if needed.
    },
    cancelChanges() {
      // Reset the profile to initial values
      this.profile = {
        name: "",
        email: "",
        logo: null,
        logoPreview: null,
      };
    },
    deleteAccount() {
      if (confirm("Are you sure you want to delete your account?")) {
        console.log("Account deleted");
        alert("Account deleted successfully.");
        //Here you can implement the account deletion logic, like making an API call to delete the account.
      }
    },
    goBack() {
      this.$router.go(-1); // Go back one route
    },
  },
};
</script>
