<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import genAiService from '@/services/gen-ai'
import { imageUrl } from '@/utils/utils'
import { formatDistanceToNow } from 'date-fns'

const router = useRouter()
const isOpen = ref(false)
const boardName = ref('')
const isSecret = ref(false)
const collaborators = ref('')
const SearchTerm = ref('')
const collaboratorSearch = ref([])
const boards = ref([])

const openBoardImage = (board) => {
  router.push({ path: '/boardAllImages', query: { board: board } })
}

const createBoard = () => {
  console.log({
    boardName: boardName.value,
    isSecret: isSecret.value,
    collaborators: collaborators.value,
  })
  isOpen.value = false
}

const getAllBoards = async () => {
  try {
    const response = await genAiService.getBoardsInfo()
    boards.value = response.data.data.map((item) => ({
      name: item.boardName,
      images: item.images.map((img) => img.imageKey),
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
        images: item.images.map((img) => img.imageKey),
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

const searchCollaborator = async (data) => {
  try {
    const response = await genAiService.searchCollabarator(data)
    collaboratorSearch.value = response.data.data.map((item) => ({
      name: item.name,
      email: item.email,
    }))
  } catch (error) {
    console.error('Error fetching boards:', error)
  }
}

const handleCollaboratorSearch = (e) => {
  SearchTerm.value = e.target.value
}

watch(SearchTerm, (newVal) => {
  if (newVal.length > 0) {
    searchCollaborator(newVal)
  } else {
    collaboratorSearch.value = []
  }
})

onMounted(() => {
  getAllBoards()
  getCollaborateBoards()
})
</script>

<template>
  <DefaultLayout>
    <div class="flex justify-between p-2">
      <div><img class="h-12 w-12" src="/public/images/icon/filterIcon.svg" alt="" /></div>
      <div @click="isOpen = true">
        <img class="h-12 w-12" src="/public/images/icon/CreateIcon.svg" alt="" />
      </div>
    </div>
    <div class="grid grid-cols-5 gap-2 p-2">
      <!-- cards album -->
      <div v-for="(board, index) in boards" :key="index">
        <div class="w-full pointer-events-auto" @click="openBoardImage(board.name)">
          <img
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
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b pb-4">
        <h2 class="text-xl font-medium">Create Board</h2>
        <button @click="isOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <!-- Modal Content -->
      <form class="space-y-4 mt-4">
        <!-- Board Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            v-model="boardName"
            placeholder="Link 'Places to Go' or 'Recipes to Make'"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div class="flex items-start space-x-2">
          <input
            id="secret"
            type="checkbox"
            v-model="isSecret"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="secret" class="text-sm text-gray-700">
            Keep this board secret <br />
            <span class="text-gray-500 text-xs"> So only you and collaborators can see it. </span>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Add Collaborators</label>
          <input
            type="text"
            @change="handleCollaboratorSearch"
            v-model="SearchTerm"
            placeholder="Search by name or email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <ul
            v-if="collaboratorSearch.length > 0"
            class="mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <li
              v-for="(collab, index) in collaboratorSearch"
              :key="index"
              @click="selectCollaborator(collab)"
              class="p-2 cursor-pointer hover:bg-gray-200"
            >
              {{ collab.name }} - {{ collab.email }}
            </li>
          </ul>
        </div>
        <button
          type="button"
          @click="createBoard"
          class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  </div>
</template>
