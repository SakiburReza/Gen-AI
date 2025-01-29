<script setup>
import Navbar from '@/components/NavBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'

const router = useRouter()

const openBoardImage = () => {
  router.push('/boardallimages')
}

const isOpen = ref(false)
const boardName = ref('')
const isSecret = ref(false)
const collaborators = ref('')

const createBoard = () => {
  // Handle board creation logic
  console.log({
    boardName: boardName.value,
    isSecret: isSecret.value,
    collaborators: collaborators.value,
  })
  isOpen.value = false
}
</script>

<template>
  <DefaultLayout>

    <div class="flex justify-between p-2">
      <div><img class="h-12 w-12" src="/public/images/icon/filterIcon.svg" alt="" /></div>
      <div  @click="isOpen = true">
        <img class="h-12 w-12" src="/public/images/icon/CreateIcon.svg" alt="" />
      </div>
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
          <h5 class="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Vibes</h5>
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

        <!-- Secret Checkbox -->
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

        <!-- Collaborators Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Add Collaborators</label>
          <input
            type="text"
            v-model="collaborators"
            placeholder="Search by name or email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <!-- Create Button -->
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
