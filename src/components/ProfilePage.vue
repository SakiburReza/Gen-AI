<template>
  <Navbar />
  <div class="min-h-screen bg-gray-50 grid grid-cols-3 items-center">
    <!-- First Column: Spans 2/3 of the grid -->
    <div class="col-span-2 flex flex-col items-center justify-center">
      <div class="bg-white rounded-lg shadow-md p-6 mt-10 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-6 text-black">Manage Profile</h2>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile">
          <!-- Account Name -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              id="name"
              v-model="profile.name"
              placeholder="Enter your name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Account Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Account Email</label>
            <input
              type="email"
              id="email"
              v-model="profile.email"
              placeholder="Enter your email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Account Logo Upload -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Account Logo</label>
            <div class="mt-1 flex items-center">
              <div
                class="h-16 w-16 flex items-center justify-center bg-gray-200 text-xl font-bold text-black rounded-md"
              >
                H
              </div>
              <label class="ml-4 flex items-center cursor-pointer">
              <span class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">
                Upload Logo
              </span>
                <input
                  type="file"
                  @change="uploadLogo"
                  class="hidden"
                />
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1">Min. 200x200px, PNG or JPG</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-6">
            <button
              type="button"
              @click="cancelChanges"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            class="px-4 py-2 bg-red text-white rounded-md hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Second Column: Spans 1/3 of the grid -->
    <div class="flex flex-col items-center justify-center bg-white h-full">
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
import Navbar from "@/components/Navbar.vue"; // Assuming Navbar.vue exists and is ready

export default {
  name: "ManageProfile",
  components: {
    Navbar,
  },
  data() {
    return {
      profile: {
        name: " ",
        email: " ",
        logo: null, // Placeholder for uploaded logo
      },
    };
  },
  methods: {
    uploadLogo(event) {
      const file = event.target.files[0];
      if (file) {
        this.profile.logo = file;
        console.log("Logo uploaded:", file.name);
      }
    },
    saveProfile() {
      console.log("Profile saved:", this.profile);
      alert("Profile saved successfully!");
    },
    cancelChanges() {
      // Reset form values (you can adjust it as needed)
      this.profile = {
        name: " ",
        email: " ",
        logo: null,
      };
    },
    deleteAccount() {
      if (confirm("Are you sure you want to delete your account?")) {
        console.log("Account deleted");
        alert("Account deleted successfully.");
      }
    },
    goBack() {
      // Navigate back to the create page
      this.$router.push(" ");
    },
  },
};
</script>
