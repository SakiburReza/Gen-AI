<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import { FwbTooltip } from 'flowbite-vue'
import { FwbDropdown, FwbBadge } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import AccountCard from '@/components/AccountCard.vue'
import { useCredits } from '@/utils/utils';
import { isAuthenticated } from '@/router'




const { credits, fetchCredits } = useCredits();
const router = useRouter()
const showAccountCard = ref(false)
const selectedMenu = ref('/')
const accountCardRef = ref(null)
const sidebarRef = ref(null);
const isAuthenticatedUser = ref('')
const expandSidebar = ref(false)
const isClicked = ref(false)


const props = defineProps({
  showBadge: {
    default: true,
  },
})

const handleExpandSidebar = () => {
  expandSidebar.value = !expandSidebar.value
}

const isUserAuthenticated = () => {
  isAuthenticatedUser.value = localStorage.getItem('authToken')

}

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

const handleOutsideExpandClick = (event) => {
  if (sidebarRef.value && sidebarRef.value.contains(event.target)) {
    expandSidebar.value = !expandSidebar.value;
  }
};

watch(expandSidebar, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleOutsideExpandClick)
  } else {
    document.removeEventListener('click', handleOutsideExpandClick)
  }
})

const selectMenuAndNavigate = (menu, goToFunction) => {
  selectedMenu.value = selectedMenu.value === menu ? menu : '/'
  localStorage.setItem('selectedMenu', menu)
  sessionStorage.setItem('lastVisit', menu)
  goToFunction()
}

const goToOperative = () => {
  router.push('/operativepage')
}

const goToCommunity = () => {
  router.push('/')
}

const goToGallery = () => {
  router.push('/gallerypage')
}

const goToProfilePage = () => {
  router.push('/profile')
}

const goToEditorPage = () => {
  router.push('/editorPage')
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath.includes('gallerypage')) {
      selectedMenu.value = 'gallerypage'
    } else if (newPath.includes('communitypage')) {
      selectedMenu.value = '/'
    } else if (newPath.includes('operativepage')) {
      selectedMenu.value = 'operativepage'
    }
  },
)

onMounted(() => {

  isUserAuthenticated()
  if (props.showBadge && isAuthenticatedUser) {
    fetchCredits();
  } // Fetch credits on component mount
  // const savedMenu = localStorage.getItem('selectedMenu')
  const savedMenu = sessionStorage.getItem('lastVisit')
  if (savedMenu) {
    selectedMenu.value = savedMenu
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('click', handleOutsideExpandClick)
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="flex items-center justify-start border">
      <!-- Logo -->
      <router-link to="/">
        <img src="/images/zeuxis-logo.png" alt="zeuxis logo"
          class="cursor-pointer items-center justify-center hover:opacity transition-opacity p-4" />
      </router-link>
      <!-- Text -->

      <!-- <fwb-badge v-if="props.showBadge && isAuthenticatedUser"
        :class="`flex items-center justify-between border mt-3 rounded-md ${isClicked ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black-2 border-gray-300'} rounded-full px-4 py-2 cursor-pointer shadow-sm transition duration-200`"
        size="xl" @click="toggleAccountCard">
        <p class="mr-2">Account</p>
        <svg width="30" height="21" viewBox="0 0 19 21" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2242_871)">
            <path
              d="M8.98018 0.134343L8.84188 0.265152C8.58299 1.74646 8.42695 2.58081 8.32765 3.07576C8.2319 3.57071 8.0794 4.26364 7.99074 4.61364C7.90563 4.96364 7.72121 5.58232 7.58645 5.99242C7.44814 6.40252 7.26728 6.8798 7.18216 7.05303C7.08286 7.25455 6.9481 7.45606 6.82043 7.59747C6.70695 7.72121 6.5119 7.89091 6.38422 7.97222C6.25656 8.05707 5.99412 8.20202 5.79907 8.30101C5.60402 8.39646 5.182 8.5803 4.85928 8.70758C4.53655 8.83485 3.98686 9.02576 3.63577 9.13535C3.28468 9.24141 2.66406 9.41818 2.25268 9.52778C1.84484 9.63737 1.22068 9.80707 0.869586 9.90252C0.415648 10.0263 0.20641 10.097 0.149668 10.1535C0.103565 10.1995 0.0503692 10.2914 0.0290909 10.3586C0.000719717 10.4505 0.000719717 10.5212 0.0290909 10.6343C0.0539156 10.7192 0.114204 10.8182 0.170947 10.8641C0.227689 10.9101 0.440472 10.9879 0.709998 11.0586C0.954699 11.1258 1.58596 11.2955 2.11082 11.4369C2.63924 11.5818 3.37334 11.7939 3.74216 11.9141C4.11453 12.0343 4.65713 12.2288 4.94794 12.3455C5.24229 12.4621 5.66431 12.653 5.88773 12.7662C6.11115 12.8758 6.39486 13.0419 6.51899 13.1303C6.63957 13.2187 6.80625 13.3778 6.88781 13.4803C6.96583 13.5793 7.11124 13.8232 7.20344 14.0177C7.29565 14.2121 7.46942 14.6576 7.58645 15.0076C7.70348 15.3576 7.87371 15.9268 7.96237 16.2732C8.05103 16.6162 8.19998 17.2914 8.29573 17.7758C8.39148 18.2566 8.55462 19.1192 8.65746 19.6919L8.84188 20.7348C9.10076 20.9859 9.13622 21 9.29227 21C9.41048 21 9.50505 20.9764 9.57598 20.9293C9.63272 20.8904 9.7001 20.8268 9.71783 20.7879C9.73911 20.749 9.83132 20.2682 9.93062 19.7167C10.0264 19.1687 10.1682 18.4086 10.2462 18.0303C10.3243 17.652 10.4342 17.1253 10.498 16.8636C10.5583 16.602 10.6789 16.1318 10.764 15.8207C10.8491 15.5096 10.9945 15.0394 11.0832 14.7778C11.1719 14.5162 11.3243 14.1414 11.4201 13.947C11.5194 13.7455 11.6648 13.5121 11.7641 13.4025C11.8563 13.3 12.0372 13.1444 12.1648 13.0596C12.2925 12.9783 12.6117 12.8051 12.8741 12.6813C13.1366 12.554 13.5444 12.3808 13.7785 12.2924C14.0125 12.204 14.5232 12.0308 14.9133 11.9035C15.3034 11.7763 16.0375 11.5677 16.5446 11.4404C17.0518 11.3131 17.6263 11.1611 17.8213 11.101C18.0164 11.0409 18.2434 10.9596 18.3285 10.9207C18.4242 10.8783 18.4987 10.8111 18.5342 10.7404C18.5767 10.6591 18.5874 10.5707 18.5732 10.447C18.559 10.3162 18.5271 10.2455 18.4526 10.1712C18.3746 10.097 18.2398 10.0439 17.8213 9.93081C17.5305 9.85303 16.9135 9.68687 16.456 9.56313C15.9985 9.43939 15.385 9.26263 15.0906 9.17424C14.7998 9.08232 14.3423 8.92677 14.0799 8.83131C13.8175 8.73232 13.3706 8.54848 13.0869 8.42475C12.8032 8.29747 12.4698 8.13485 12.3422 8.06061C12.2145 7.98636 12.0265 7.84848 11.9201 7.75657C11.8173 7.66111 11.6613 7.4702 11.5761 7.33586C11.4946 7.20151 11.3669 6.95404 11.296 6.78788C11.225 6.62172 11.0796 6.23283 10.9768 5.92172C10.8704 5.61061 10.7215 5.09444 10.6399 4.77273C10.5583 4.45101 10.4377 3.91717 10.3704 3.58838C10.303 3.2596 10.154 2.46414 10.037 1.82071C9.92352 1.18081 9.81004 0.565657 9.78521 0.459596C9.7533 0.311111 9.71429 0.233333 9.60789 0.134343C9.48732 0.0141414 9.44831 0 9.29227 0C9.13977 0 9.10076 0.0141414 8.98018 0.134343Z"
              :fill="isClicked ? '#ffffff' : '#000000'" />
          </g>
          <defs>
            <clipPath id="clip0_2242_871">
              <rect width="18.6186" height="21" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p class="ml-2">{{ credits }}</p>
      </fwb-badge> -->
    </div>

    <!-- Sidebar -->
    <div :class="['sidebar border mt-14 fixed left-0 h-screen z-10 flex flex-col justify-between items-center py-2 bg-white',
      !expandSidebar ? 'w-[45px]' : 'w-[150px]',
    ]">
      <div class="flex flex-col items-center gap-1  group p-2 rounded-lg
      transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md" @click="goToProfilePage">
        <div class="flex items-center cursor-pointer">
          <img src="/images/icon/avatarIcon.svg" alt="avatarIcon" class="cursor-pointer" />
          <span v-if="expandSidebar" class="ml-2">My Profile</span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-1 flex-1 justify-center">
        <fwb-tooltip v-if="!expandSidebar" placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('/', goToCommunity)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === '/' ? 'bg-[#D9D9D9]' : '',
            ]">
              <div class="flex items-center">
                <img src="/images/icon/homeIcon.svg" alt="homeIcon" class="cursor-pointer" />
                <span v-if="expandSidebar" class="ml-2">Home</span>
              </div>
            </div>
          </template>
          <template #content> Home </template>
        </fwb-tooltip>
        <template v-else>
          <div @click="selectMenuAndNavigate('/', goToCommunity)" :class="[
            'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
            selectedMenu === '/' ? 'bg-[#D9D9D9]' : '',
          ]">
            <div class="flex items-center cursor-pointer">
              <img src="/images/icon/homeIcon.svg" alt="homeIcon" class="cursor-pointer" />
              <span v-if="expandSidebar" class="ml-2">Home</span>
            </div>
          </div>
        </template>

        <fwb-tooltip v-if="!expandSidebar" placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('operativepage', goToOperative)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'operativepage' ? 'bg-[#D9D9D9]' : '',
            ]">
              <div class="flex items-center ">
                <img src="/images/icon/plusIcon.svg" alt="plusIcon" class="cursor-pointer" />
                <span v-if="expandSidebar" class="ml-2">Create</span>
              </div>
            </div>
          </template>
          <template #content> Create </template>
        </fwb-tooltip>
        <template v-else>
          <div @click="selectMenuAndNavigate('operativepage', goToOperative)" :class="[
            'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
            selectedMenu === 'operativepage' ? 'bg-[#D9D9D9]' : '',
          ]">
            <div class="flex items-center cursor-pointer">
              <img src="/images/icon/plusIcon.svg" alt="plusIcon" class="cursor-pointer" />
              <span v-if="expandSidebar" class="ml-2">Create</span>
            </div>
          </div>
        </template>
        <fwb-tooltip v-if="!expandSidebar" placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('gallerypage', goToGallery)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'gallerypage' ? 'bg-[#D9D9D9]' : '',
            ]">
              <div class="flex items-center">
                <img src="/images/icon/dataIcon.svg" alt="dataIcon" class="cursor-pointer" />
                <span v-if="expandSidebar" class="ml-2">Boards</span>
              </div>
            </div>
          </template>
          <template #content> Boards </template>
        </fwb-tooltip>
        <template v-else>
          <div @click="selectMenuAndNavigate('gallerypage', goToGallery)" :class="[
            'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
            selectedMenu === 'gallerypage' ? 'bg-[#D9D9D9]' : '',
          ]">
            <div class="flex items-center cursor-pointer">
              <img src="/images/icon/dataIcon.svg" alt="dataIcon" class="cursor-pointer" />
              <span v-if="expandSidebar" class="ml-2">Boards</span>
            </div>
          </div>
        </template>

        <!-- //testcode for editor -->
        <fwb-tooltip v-if="!expandSidebar" placement="right">
          <template #trigger>
            <div @click="selectMenuAndNavigate('editorPage', goToEditorPage)" :class="[
              'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
              selectedMenu === 'editorPage' ? 'bg-[#D9D9D9]' : '',
            ]">
                <div class="flex items-center">
                <img src="/images/icon/star.svg" alt="dataIcon" class="cursor-pointer" />
                <span v-if="expandSidebar" class="ml-2">Editor</span>
                </div>
            </div>
          </template>
          <template #content> Editor </template>
        </fwb-tooltip>

        <template v-else>
            <div @click="selectMenuAndNavigate('editoPage', goToEditorPage)"
          :class="[
            'group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md',
            selectedMenu === 'editoPage' ? 'bg-[#D9D9D9]' : '',
          ]">
            <div class="flex items-center cursor-pointer gap-1">
              <img src="/images/icon/star.svg" alt="starIcon" class="cursor-pointer" />
              <span v-if="expandSidebar" class="ml-2">Editor</span>
            </div>
          </div>
        </template>


        <!-- //testcode for editor -->
      </div>

      <div class="flex flex-col items-center gap-1 mb-12">
        <div class="rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md cursor-pointer">
          <div v-if="!expandSidebar" @click="handleExpandSidebar">
            <img src="/images/icon/expandRightArrow.svg" alt="dataIcon" class="group p-2" />
            <span></span>
          </div>

          <div v-if="expandSidebar" @click="handleExpandSidebar">
            <img src="/images/icon/expandLeftArrow.svg" alt="dataIcon" class="group p-2 mr-14" />
            <span></span>
          </div>
        </div>

        <FwbDropdown placement="right" align-to-end>
          <template #trigger>
            <div
              class="flex items-center cursor-pointer group p-2 rounded-lg transition duration-200 hover:bg-[#D9D9D9] hover:shadow-md">
              <img src="/images/icon/burgerIcon.svg" alt="burgerIcon" class="cursor-pointer" />
              <span v-if="expandSidebar" class="ml-2">Menu</span>
            </div>
          </template>
          <div class="bg-blue">
            <AccountCard />
          </div>
        </FwbDropdown>
      </div>
    </div>

    <!-- Main Content -->
    <div @click="handleOutsideExpandClick(1)" ref="sidebarRef"
      :class="['flex-1 overflow-auto transition duration-200 bg-[#FCFDFD]', expandSidebar ? 'pl-[150px]' : 'pl-[45px]']">
      <slot />
    </div>
  </div>
</template>
