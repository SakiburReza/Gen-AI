<script setup>
import { ref } from 'vue'
import { FwbModal } from 'fwb-modal'
import 'fwb-modal/dist/style.css'

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
  <FwbModal v-model="isOpen" title="Create Board" class="p-4">
    <form class="space-y-4">
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
          <span class="text-gray-500 text-xs">
            So only you and collaborators can see it.
          </span>
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
  </FwbModal>

  <!-- Open Modal Button -->
  <button
    @click="isOpen = true"
    class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
  >
    Open Modal
  </button>
</template>

<style scoped>
/* Add any additional custom styles if needed */
</style>
