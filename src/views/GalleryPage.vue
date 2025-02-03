<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import genAiService from '@/services/gen-ai'
import { imageUrl } from '@/utils/utils'
import { formatDistanceToNow } from 'date-fns'
import CreateBoardModal from '@/components/CreateBoardModal.vue'

const router = useRouter()
const isOpen = ref(false)
const boards = ref([])
const unserData = ref([])

const openBoardImage = (board) => {
  router.push({ path: '/boardAllImages', query: { board: board } })
}

const getuserInfo = async () => {
  try {
    const response = await genAiService.fetchUserProfile()
     unserData.value = response.data.data
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

const getAllBoards = async () => {
  try {
    const response = await genAiService.getBoardsInfo()
    boards.value = response.data.data.map((item) => ({
      name: item.boardName,
      images: item.images.map((img) => img.content),
      lastModified: item.lastModified,
    }))
  } catch (error) {
    console.error('Error fetching boards:', error)
  }
}

const getCollaborateBoards = async () => {
  try {
    const response = await genAiService.getCollaborateBoardsInfo()
    boards.value.push(
      ...response.data.data.map((item) => ({
        name: item.boardName,
        images: item.images.map((img) => img.content),
        lastModified: item.lastModified,
      })),
    )
  } catch (error) {
    console.error('Error fetching boards:', error)
  }
}

const timeAgo = (lastModified) => {
  const date = new Date(lastModified)
  return formatDistanceToNow(date, { addSuffix: true }).replace(/^about /, '')
}

const handleBoardCreated = () => {
  getAllBoards()
}

onMounted(() => {
  getAllBoards()
  // getCollaborateBoards()
  getuserInfo()
})
</script>

<template>
  <DefaultLayout>
    <!-- user information -->
    <div class="flex items-center justify-center mt-2">
    <div class="bg-white p-6 w-80 text-center">
      <img 
        :src="unserData?.profilePicture"
        alt="Profile" 
        class="w-24 h-24 mx-auto border-4" 
      />
      <h2 class="text-xl font-semibold mt-4">{{ unserData?.userProfile?.name }}</h2>
      <p class="text-gray-500 text-sm">{{ unserData?.userProfile?.email }}</p>
      <p class="text-gray-700 font-medium mt-2">0 Following</p>
      <div class="flex justify-center gap-3 mt-4">
        <button class="bg-black text-white px-4 py-2 rounded-lg">Share</button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit Profile</button>
      </div>
      <div class="flex justify-center text-gray-400 text-sm mt-4">
        <span class="mr-3 text-black">Created</span>
        <span class="text-blue-600">Saved</span>
      </div>
    </div>
  </div>


    <!-- filter and create board -->
    <div class="flex justify-between p-2">
      <div><img class="h-12 w-12" src="/public/images/icon/filterIcon.svg" alt="" /></div>
      <div @click="isOpen = true">
        <img class="h-12 w-12" src="/public/images/icon/CreateIcon.svg" alt="" />
      </div>
    </div>
    <!-- boards -->
    <div class="grid md:grid-cols-5 grid-cols-2 gap-2 p-2">
      <!-- cards album -->
      <div v-for="(board, index) in boards" :key="index">
        <div class="w-full pointer-events-auto" @click="openBoardImage(board.name)">
          <img
            class="rounded border cursor-pointer w-100 h-50 object-cover"
            :src="board.images[0] ? imageUrl() + board.images[0] : '/src/assets/icon/NoImageBox.svg'"
            alt=""
          />
          <div class="grid grid-cols-2 mt-1 gap-1">
            <img
              class="rounded border cursor-pointer w-50 h-50  object-cover"
              :src="board.images[1] ? imageUrl() + board.images[1] : '/src/assets/icon/NoImageBox.svg'"
              alt=""
            />
            <img
              class="rounded border cursor-pointer w-50 h-50 object-cover"
              :src="board.images[2] ? imageUrl() + board.images[2] : '/src/assets/icon/NoImageBox.svg'"
              alt=""
            />
          </div>
        </div>
        <div class="p-5">
          <h5 class="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {{ board.name }}
          </h5>
          <p class="font-bold">
            {{ board.images.length }} photos
            <span class="ml-2 opacity-50">{{ timeAgo(board.lastModified) }}</span>
          </p>
        </div>
      </div>
    </div>
  </DefaultLayout>

  <!-- Modal -->

  <CreateBoardModal
    :isOpen="isOpen"
    @update:isOpen="isOpen = false"
    @boardCreated="handleBoardCreated"
  ></CreateBoardModal>
</template>
