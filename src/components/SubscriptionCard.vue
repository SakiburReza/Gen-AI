<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: "Basic Creator",
      featureList: [
        { name: "2250 Credits", isActive: true },
        { name: "50 GB of Storage", isActive: true },
        { name: "No Access to Face Swap", isActive: false },
        { name: "No Access to Templates", isActive: false },
        { name: "No Access to Creator Network", isActive: false },
      ],
      comments: "Lowest!",
      price: "$12.99"
    }),

  },
  isStyle: {
    type: Boolean,
    default: true,
  }
});
</script>
<template>

  <div class="flex flex-col lg:flex-row gap-6 ">
    <!-- First Card Component -->
    <div :class="{
       'w-full max-w-xs border rounded-3xl p-6 relative justify-start mx-auto': true,
      'border-blue-600': isStyle,
      'bg-blue-600': !isStyle
    }">
      <h2 class="text-2xl font-bold mb-4" :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">{{
        data.title }}</h2>

      <!-- Feature List with Radio Button -->

      <div class="space-y-1 mb-6 ">
        <label v-for="(feature, index) in data.featureList" :key="index"
          class="flex items-center space-x-2 cursor-not-allowed">
          <img v-if="feature.isActive && !isStyle" class="h-4 w-4 " src="/images/icon/radio_button_checked.svg" alt="">
          <img v-else-if="feature.isActive && isStyle" class="h-4 w-4 " src="/images/icon/radio_button_checked_blue.svg"
            alt="">
          <img v-else class="h-4 w-4 " src="/images/icon/radio_button_checked_red.svg" alt="">
          <span :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">
            {{ feature.name }}
          </span>
        </label>
      </div>
      <br><br>

      <!-- Price Section with Badge -->
      <div class="relative mb-5 inline-block">
        <span
          class="absolute -top-7 left-1/4 -translate-x-1/4 bg-blue-600 text-white text-sm px-5 py-1 rounded-2xl -rotate-6 text-nowrap"
          :class="data.title === 'Next Up Creator' ? 'text-black bg-parrot' : 'text-black'">
          {{ data.comments }}
        </span>

        <span class="text-3xl font-bold" :class="data.title === 'Next Up Creator' ? 'text-white' : 'text-black'">{{
          data.price }}</span>
      </div>

      <div class="border-solid lg:border-dashed">
        <p>- - - - - - - - - - - - - - - - - - - - - - - - - - - -  </p>
      </div>
      <br>

      <!-- CTA Button -->
      <button class="w-full bg-black text-white text-sm py-3 rounded-lg hover:bg-gray-800">
        Zeux It Now
      </button>

    </div>

  </div>



</template>

<style scoped>
/* Optional Custom Styles */
</style>