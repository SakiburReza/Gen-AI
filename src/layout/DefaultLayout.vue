<script setup>
import {ref} from 'vue'
import { FwbTooltip } from 'flowbite-vue'
import {useRouter } from 'vue-router'
import AccountCard from '@/components/AccountCard.vue'






const router = useRouter()
const showAccountCard = ref(false);
const isClicked = ref(false);


const  toggleAccountCard=()=> {
  showAccountCard.value = !showAccountCard.value;
  isClicked.value = !isClicked.value;
}

const goToExplore = () => {
  router.push('/operativepage')
}
function closeAccountCard() {
  showAccountCard.value = false;
  isClicked.value = false;
}

</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="Header flex items-center border fixed top-0 left-0 w-full bg-white z-10 h-[60px]">
      <img src="/images/zeuxis-logo.png" alt="zeuxis-logo" class="cursor-pointer ml-5" @click="goToExplore" />
    </div>

    <div class="flex flex-1">
      <div
        class="sidebar border fixed left-0 h-screen w-[45px] left-0 flex flex-col justify-between items-center py-4"
      >
        <div class="flex flex-col items-center gap-4 flex-1 justify-center">
          <fwb-tooltip placement="right">
            <template #trigger>
              <img src="/public/images/icon/homeIcon.svg" alt="homeIcon" class="cursor-pointer" />
            </template>
            <template #content> Home </template>
          </fwb-tooltip>

          <fwb-tooltip placement="right">
            <template #trigger>
              <img src="/public/images/icon/plusIcon.svg" alt="plusIcon" class="cursor-pointer" />
            </template>
            <template #content> Create </template>
          </fwb-tooltip>

          <fwb-tooltip placement="right">
            <template #trigger>
              <img src="/public/images/icon/dataIcon.svg" alt="dataIcon" class="cursor-pointer" />
            </template>
            <template #content> Explore </template>
          </fwb-tooltip>
        </div>

        <div class="flex flex-col items-center gap-4">
          <FwbTooltip placement="right" >
            <template #trigger>
              <img src="/public/images/icon/QuestionIcon.svg" alt="questionIcon" class="cursor-pointer"  @click="toggleAccountCard"/>
            </template>
            <template #content> Help </template>
          </FwbTooltip>

          <FwbTooltip placement="right">
            <template #trigger>
              <img src="/public/images/icon/profileIcon.svg" alt="profileIcon" class="cursor-pointer" @click="toggleAccountCard" />
            </template>
            <template #content> Profile </template>
          </FwbTooltip>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 mt-[60px] overflow-auto">
        <slot />
      </div>
    </div>
  </div>
  
  <div v-if="showAccountCard">
      <div
        class="inset-0 bg-opacity-25 z-0"
        @click="closeAccountCard"
      ></div>
      <AccountCard
        class="right-80 bottom-25 fixed bottom-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        v-if="showAccountCard"
        @close="toggleAccountCard"
      />
    </div>
</template>

