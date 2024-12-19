<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <!-- Sidebar container adjusted for responsiveness -->
    <div class="w-full sm:w-64 bg-white shadow rounded-lg">
      <ul class="divide-y divide-gray-200">
        <li>
          <a
            @click="navigateTo('/profile')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-blue-600 cursor-pointer rounded-lg transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.75a6 6 0 106 6 6 6 0 00-6-6z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 14.25a6 6 0 016 6H6a6 6 0 016-6z"
              />
            </svg>
            Manage Profile
          </a>
        </li>
        <li>
          <a
            @click="navigateTo('/subscription')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-blue-600 cursor-pointer rounded-lg transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.75v14.5m-7.25-7.25h14.5"
              />
            </svg>
            Manage Subscription
          </a>
        </li>
        <li>
          <a
            @click="navigateTo('/logout')"
            class="flex items-center px-4 py-3 text-black-2 hover:bg-blue-600 cursor-pointer rounded-lg transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9.25V4.75h-7.5v4.5"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.75 9.75l-5.25 5.25M15.75 20.25H4.5"
              />
            </svg>
            Log Out
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(url) {
      console.log(`Navigating to: ${url}`);
      this.$router.push(url);
    },
  },
};
</script>

<style scoped>
a {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

a:hover {
  transform: scale(1);
}
</style>
