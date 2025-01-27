<script setup>
import Navbar from '@/components/NavBar.vue'



const openBoardImage = () => {
    router.push('/boardallimage')

}
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="grid grid-cols-5 gap-2 p-2">
          <img class="rounded-lg border cursor-pointer" src="/public/images/slides.png" alt="" />
          <img class="rounded-lg border cursor-pointer" src="/public/images/slides.png" alt="" />
      </div>
    </div>
</template>
