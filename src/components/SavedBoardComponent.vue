<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { Plus, X, Search } from 'lucide-vue-next'
import genAiService from '@/services/gen-ai'
import { imageUrl } from '@/utils/utils'
import { useToastStore } from '@/stores/toast'
import CreateBoardModal from './CreateBoardModal.vue'

const props = defineProps({
  image: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close', 'updateAfterSave'])

const search = ref('')
const toastStore = useToastStore()
const isModalOpen = ref(false)
const boardLists = ref([])
const searchQuery = ref('')

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleBoardCreated = () => {
  getBoardLists()
  closeModal()
}

const getBoardLists = async () => {
  try {
    const payload = {
      imageUrl: props.image,
    }
    const response = await genAiService.getBoardList(payload)
    boardLists.value = response.data.data
  } catch (error) {}
}

const saveBoardImages = async (board) => {
  try {
    const payload = {
      boardName: board.boardName,
      imageKey: props.image,
    }

    const response = await genAiService.saveBoardImages(payload)
    if (response.data && response.data.status) {
      toastStore.success(response?.data.message)
      emit('updateAfterSave', {
        imageKey: response.data.data.content,
        boardName: response.data.data.boardName,
      })
      onClose()
    } else {
    }
  } catch (error) {}
}

onMounted(() => {
  getBoardLists()
})

const filteredBoards = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return boardLists.value
  }
  return boardLists.value.filter((item) => {
    const boardName = item.boardName ? item.boardName.toLowerCase() : ''
    return boardName.includes(searchQuery.value.toLowerCase())
  })
})

const onClose = () => {
  emit('close')
}
const handleOutsideClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center" @click="handleOutsideClick">
    <div class="bg-white p-5 rounded-lg w-[500px] shadow-lg relative border-2 mt-30">
      <h2 class="text-xl font-bold mb-4 text-center">Save Board</h2>
      <button class="absolute top-2 right-2" @click="onClose">
        <X size="24" />
      </button>

      <!-- Search Input with Icon -->
      <div class="relative mb-4 bg-tertiary rounded-md">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size="18"
        />
        <input
          v-model="searchQuery"
          placeholder="Search board name"
          class="p-4 pl-10 border border-gray-300 bg-tertiary rounded w-full"
        />
      </div>

      <h6 class="text-md text-gray-600 mb-2 pl-3">Save to Board</h6>

      <!-- Board List Aligned to Left -->
      <div class="h-72 overflow-y-auto">
        <div
          v-for="(board, index) in filteredBoards"
          :key="index"
          class="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md"
          :class="{
            'opacity-30 cursor-not-allowed': board.exists,
            'cursor-pointer': !board.exists,
          }"
          @click="!board.exists && saveBoardImages(board)"
        >
          <img
            v-if="board.images && board.images.length"
            :src="imageUrl() + board.images[0].content"
            :alt="board.boardName"
            class="w-12 h-12 rounded-md object-cover"
          />
          <div v-else class="w-12 h-12 rounded-md bg-gray-300" />
          <span class="text-base font-medium">{{ board.boardName }}</span>
        </div>
      </div>

      <!-- Create Board Button -->
      <div
        class="mt-6 flex items-center gap-3 text-blue-600 font-bold cursor-pointer"
        @click="openModal"
      >
        <div class="bg-blue-600 bg-opacity-15 p-2 rounded flex items-center justify-center">
          <Plus size="24" class="text-blue-600" />
        </div>
        <span>Create Board</span>
      </div>

      <CreateBoardModal
        :isOpen="isModalOpen"
        @update:isOpen="isModalOpen = false"
        @boardCreated="handleBoardCreated"
      ></CreateBoardModal>
    </div>
  </div>
</template>
