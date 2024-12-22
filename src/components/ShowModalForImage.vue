<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    }
});
const emit = defineEmits(["close"]);

// Close modal method
const closeModal = () => {
    emit("close");
};
</script>
<template>
    <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" v-if="isOpen">
        <div class="bg-tertiary rounded-lg shadow-lg w-full max-w-5xl h-[50vh] p-6 relative">
            <!-- Close Button -->
            <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                ✕
            </button>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <!-- Image Section -->
                <!-- Image Section -->
                <div class="h-full md:h-auto md:col-span-1 w-full">
                    <div class="w-full h-full">
                        <img src="/images/carImage.png" alt="Generated Image"
                            class="rounded-lg w-full h-full object-fill" />
                    </div>
                </div>


                <!-- Details Section -->
                <div class="md:col-span-2 bg-white shadow-lg rounded-lg p-15">
                    <!-- Title -->
                    <h3 class="text-sm font-semibold text-gray-900 mb-20">Photo Details</h3>

                    <!-- Prompt -->
                    <div class="mb-7">
                        <p class="text-gray-600 font-bold text-sm ">Prompt :</p>
                        <p class="text-sm text-silverChalice pt-1 ">
                            A bottom-up image of a girl walking confidently down the city streets
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-start">
                        <button
                            class="bg-blue-600 text-white text-xs px-16 py-2 rounded-lg hover:bg-blue-600  md:w-auto">
                            Turn into Video
                        </button>
                        <button
                            class="bg-silverChalice text-xs text-black px-16 py-2 rounded-lg hover:bg-silverChalice  md:w-auto mt-4 md:mt-0">
                            Image Reference
                        </button>
                    </div>


                    <!-- Download Link -->
                    <div class="mt-5 text-center">
                        <a href="#"
                            class="flex items-start justify-start text-black text-xs px-1 font-semibold py-3">
                            <img src="/public/images/icon/downloadButton.svg" alt="Download Icon" class="w-5 h-5 mr-1.5">
                            DOWNLOAD
                        </a>
                    </div>

                </div>

            </div>
        </div>
    </div>



</template>

<style scoped></style>
