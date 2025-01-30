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



const openBoardImage = (board) => {
  router.push({ path: '/boardAllImages', query: { board: board } })
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
  getCollaborateBoards()
})
</script>

<template>
  <DefaultLayout>
    <div class="flex justify-between p-2">
      <div><img class="h-12 w-12" src="/public/images/icon/filterIcon.svg" alt="" /></div>
      <div @click="isOpen= true">
        <img class="h-12 w-12" src="/public/images/icon/CreateIcon.svg" alt="" />
      </div>
    </div>
    <div class="grid grid-cols-5 gap-2 p-2">
      <!-- cards album -->
      <div v-for="(board, index) in boards" :key="index">
        <div class="w-full pointer-events-auto" @click="openBoardImage(board.name)">
          <img
            v-if="board.images[0]"
            class="rounded border cursor-pointer w-75 h-50"
            :src="imageUrl() + board.images[0]"
            alt=""
          />
          <div class="grid grid-cols-2 mt-1 gap-1">
            <img
              v-if="board.images[1]"
              class="rounded border cursor-pointer w-50 h-50"
              :src="imageUrl() + board.images[1]"
              alt=""
            />
            <img
              v-if="board.images[2]"
              class="rounded border cursor-pointer w-50 h-50"
              :src="imageUrl() + board.images[2]"
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
    :isOpen="isOpen" @update:isOpen="isOpen = false" @boardCreated="handleBoardCreated"
  ></CreateBoardModal>
  
</template>
