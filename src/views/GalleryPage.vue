<script setup>
import Navbar from '@/components/NavBar.vue'
import { useRoute, useRouter } from 'vue-router'



const router = useRouter()

const openBoardImage = () => {
    router.push('/boardallimages')

}
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />

    <div class="flex justify-between p-4">
        <div><img class="h-12 w-12" src="/public/images/icon/filterIcon.svg" alt=""></div>
        <div><img class="h-12 w-12" src="/public/images/icon/CreateIcon.svg" alt=""></div>
    </div>
    <div class="grid grid-cols-5 gap-2 p-2">
      <!-- cards album -->
       <!-- card1 -->
      <div class="max-w-sm">
        <div class="w-full pointer-events-auto" @click="openBoardImage">
          <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
          <div class="grid grid-cols-2 mt-1 gap-1">
            <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
            <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
          </div>
        </div>
        <div class="p-5">
          <h5 class="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Vibes
          </h5>
          <p class="font-bold">3 photos <span class="ml-2 opacity-50">2h ago</span></p>
        </div>
      </div>
        <!-- card2 -->
        <div class="max-w-sm">
        <div class="w-full pointer-events-auto">
          <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
          <div class="grid grid-cols-2 mt-1 gap-1">
            <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
            <img class="rounded border cursor-pointer" src="/public/images/slides.png" alt="" />
          </div>
        </div>
        <div class="p-5">
          <h5 class="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Nature
          </h5>
          <p class="font-bold">5 photos <span class="ml-2 opacity-50">4h ago</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
