<script setup>
import { ref, computed } from "vue";
import { Plus, X, Search } from "lucide-vue-next"; // Import Search icon

defineProps({});
const emit = defineEmits(["close"]);

const search = ref("");
const boards = ref([
    { name: "Vibes" , image: "/public/images/vibes.png"  },
    { name: "Nature", image: "/public/images/nature.png" },
    { name: "Beauty Hill", image: "/public/images/hill.png" },
    { name: "Draft"  , image: null},
    { name: "Vault" , image: null},
]);

const filteredBoards = computed(() =>
    boards.value.filter((board) => board.name.toLowerCase().includes(search.value.toLowerCase()))
);

const onClose = () => {
    emit("close");
};

const createBoard = () => {
    console.log("Creating new board");
};
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-5 rounded-lg w-[500px] shadow-lg relative">
            <h2 class="text-xl font-bold mb-4 text-center">Save Board</h2>
            <button class="absolute top-2 right-2" @click="onClose">
                <X size="24" />
            </button>

            <!-- Search Input with Icon -->
            <div class="relative mb-4 bg-tertiary rounded-md">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="18" />
                <input v-model="search" placeholder="Search"
                    class="p-4 pl-10 border border-gray-300 bg-tertiary rounded w-full" />
            </div>

            <h6 class="text-md text-gray-600 mb-2 pl-3">Save to Board</h6>

            <!-- Board List Aligned to Left -->
            <div class="h-72 overflow-y-auto">
                <div v-for="(board, index) in filteredBoards" :key="index"
                    class="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                    <img v-if="board.image" :src="board.image" :alt="board.name"
                        class="w-12 h-12 rounded-md object-cover" />
                    <div v-else class="w-12 h-12 rounded-md bg-gray-300" />
                    <span class="text-base font-medium">{{ board.name }}</span>
                </div>
            </div>

            <!-- Create Board Button -->
            <div class="mt-6 flex items-center gap-3 text-blue-600 font-bold cursor-pointer" @click="createBoard">
                <div class="bg-blue-600 bg-opacity-15 p-2 rounded flex items-center justify-center">
                    <Plus size="24" class="text-blue-600" />
                </div>
                <span>Create Board</span>
            </div>

        </div>
    </div>
</template>


<style></style>
