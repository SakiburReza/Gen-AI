<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { FwbTooltip } from 'flowbite-vue'
import { FwbDropdown } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import AccountCard from '@/components/AccountCard.vue'
import avatarIcon from '@/assets/icon/avatarIcon.svg'

const router = useRouter()
const showAccountCard = ref(false)
const selectedMenu = ref('communitypage')
const accountCardRef = ref(null)

const toggleAccountCard = () => {
  showAccountCard.value = !showAccountCard.value
}
const handleOutsideClick = (event) => {
  if (accountCardRef.value && !accountCardRef.value.contains(event.target)) {
    showAccountCard.value = !showAccountCard.value
  }
}

watch(showAccountCard, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleOutsideClick)
  } else {
    document.removeEventListener('click', handleOutsideClick)
  }
})

const selectMenuAndNavigate = (menu, goToFunction) => {
  selectedMenu.value = selectedMenu.value === menu ? '' : menu
  localStorage.setItem('selectedMenu', menu)
  goToFunction()
}

const goToOperative = () => {
  router.push('/operativepage')
}

const goToCommunity = () => {
  router.push('/communitypage')
}

const goToGallery = () => {
  router.push('/gallerypage')
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath.includes('gallerypage')) {
      selectedMenu.value = 'boards'
    } else if (newPath.includes('communitypage')) {
      selectedMenu.value = 'home'
    } else if (newPath.includes('operativepage')) {
      selectedMenu.value = 'create'
    }
  },
)

onMounted(() => {
  const savedMenu = localStorage.getItem('selectedMenu')
  if (savedMenu) {
    selectedMenu.value = savedMenu
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="Header flex items-center border fixed top-0 left-0 w-full bg-white z-20 h-[60px]">
      <img src="/images/zeuxis-logo.png" alt="zeuxis-logo" class="cursor-pointer ml-5" @click="goToOperative" />
    </div>

    <!-- Sidebar -->
    <div class="sidebar border fixed left-0 h-screen w-[45px] flex flex-col justify-between items-center py-4 z-10">
      <div class="flex flex-col items-center gap-4 mt-16">
        <img src="/src/assets/icon/avatarIcon.svg" alt="avatarIcon" class="cursor-pointer" />
      </div>

      <div class="flex flex-col items-center gap-4 flex-1 justify-center">
        <fwb-tooltip placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('home', goToCommunity)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'home' ? 'bg-[#D9D9D9]' : '',
            ]">
              <img src="/src/assets/icon/homeIcon.svg" alt="homeIcon" class="cursor-pointer" />
            </div>
          </template>
          <template #content> Home </template>
        </fwb-tooltip>

        <fwb-tooltip placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('create', goToOperative)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'create' ? 'bg-[#D9D9D9]' : '',
            ]">
              <img src="/src/assets/icon/plusIcon.svg" alt="plusIcon" class="cursor-pointer" />
            </div>
          </template>
          <template #content> Create </template>
        </fwb-tooltip>

        <fwb-tooltip placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('boards', goToGallery)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'boards' ? 'bg-[#D9D9D9]' : '',
            ]">
              <img src="/src/assets/icon/dataIcon.svg" alt="dataIcon" class="cursor-pointer" />
            </div>
          </template>
          <template #content> Boards </template>
        </fwb-tooltip>
      </div>

      <div class="flex flex-col items-center gap-4">
        <FwbDropdown placement="right" align-to-end>
          <template #trigger>
            <img src="/src/assets/icon/burgerIcon.svg" alt="burgerIcon" class="cursor-pointer" />
          </template>
          <div class="bg-blue">
            <AccountCard/>
          </div>
        </FwbDropdown>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 mt-[60px] overflow-auto pl-[45px]">
      <slot />
    </div>

  </div>
</template>
