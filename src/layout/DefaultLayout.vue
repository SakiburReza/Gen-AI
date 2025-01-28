<script setup>
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="Header flex items-center border fixed top-0 left-0 w-full bg-white z-10 h-[60px]">
      <img src="/images/zeuxis-logo.png" alt="zeuxis-logo" class="cursor-pointer ml-5" />
    </div>

    <div class="flex flex-1">
      <div
        class="sidebar border h-screen w-[45px] left-0 flex flex-col justify-between items-center py-4"
      >
        <div class="flex flex-col items-center gap-4 mt-[250px]">
          <img src="/public/images/icon/homeIcon.svg" alt="homeIcon" />
          <img src="/public/images/icon/plusIcon.svg" alt="plusIcon" />
          <img src="/public/images/icon/dataIcon.svg" alt="dataIcon" />
        </div>

        <div class="flex flex-col items-center gap-4">
          <img src="/public/images/icon/QuestionIcon.svg" alt="questionIcon" />
          <img src="/public/images/icon/profileIcon.svg" alt="profileIcon" />
        </div>
      </div>

      <div class="flex-1 mt-[60px] overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
