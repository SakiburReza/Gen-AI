<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, X, Search } from "lucide-vue-next";
import genAiService from '@/services/gen-ai';
import { imageUrl } from "@/utils/utils";

defineProps({});
const emit = defineEmits(["close"]);

const search = ref("");
const boards = ref([]); // Store multiple boards

const fetchBoards = async () => {
    
        try {
            const response = await genAiService.getBoardsInfo();

            if (response?.data?.status && Array.isArray(response?.data?.data)) {
                boards.value = response.data.data.map((item) => ({
                    url: item?.content || "", // Ensure a default value
                    images: Array.isArray(item?.images) ? item.images : [], // Ensure images is an array
                    collaborators: Array.isArray(item?.collaborators) ? item.collaborators : [],
                    lastModified: item?.lastModified || "Unknown",
                    boardName: item?.boardName || "Untitled",
                }));
            } else {
                console.error("Invalid response structure:", response?.data);
                boards.value = []; // Ensure boards is always an array
            }
        } catch (error) {
            console.error("Error fetching boards:", error?.response?.data || error.message);
        }
};

const boardSavedData = ref({
    boardName: '',
    collaboratorEmails: [],
    imageKey: ''
})


const saveBoardImages = async (board) => {
    try {
        // Define the payload using board data
        const payload = {
            boardName: board.boardName,
            collaboratorEmails: board.collaborators || [], // Ensure it's an array
            imageKey: board.images.length > 0 ? board.images[0].imageKey : "" // Use first image if available
        };

        // Call API and pass the data
        const response = await genAiService.saveBoardImages(payload);

        if (response.data && response.data.status) {
            console.log("Board images saved successfully!");
            // Update boardSavedData with response data
            boardSavedData.value.boardName = response.data.boardName;
            boardSavedData.value.collaboratorEmails = response.data.collaboratorEmails;
            boardSavedData.value.imageKey = response.data.imageKey;
        } else {
            console.error('Invalid response structure:', response);
        }
    } catch (error) {
        console.error('Error saving board images:', error);
    }
};



onMounted(fetchBoards);

const filteredBoards = computed(() =>
    boards.value.filter((board) =>
        board.boardName?.toLowerCase().includes(search.value.toLowerCase())
    )
);

const onClose = () => {
    emit("close");
};
const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
        // close();
        emit("close");
    }
}

</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" @click="handleOutsideClick">
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
                    <img v-if="board.images && board.images.length" :src="imageUrl() + board.images[0].imageKey"
                        :alt="board.boardName" class="w-12 h-12 rounded-md object-cover" />
                    <div v-else class="w-12 h-12 rounded-md bg-gray-300" />
                    <span class="text-base font-medium" @click="saveBoardImages(board)">{{ board.boardName }}</span>
                </div>
            </div>

            <!-- Create Board Button -->
            <div class="mt-6 flex items-center gap-3 text-blue-600 font-bold cursor-pointer">
                <div class="bg-blue-600 bg-opacity-15 p-2 rounded flex items-center justify-center">
                    <Plus size="24" class="text-blue-600" />
                </div>
                <span>Create Board</span>
            </div>

        </div>
    </div>
</template>
