<script setup lang="ts">
import { ref } from 'vue';



const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    cardOne: {
        type: Object,
        default: () => ({
            title: "Next Up Creator",
            credit: "2000",
            date: "Jan.11, 2025",
        }),
    },
    cardTwo: {
        type: Object,
        default: () => ({
            credit: "20"
        })
    },
    cardArray: {
        type: Array,
        default: () => ([
            {
                credits: "500",
                price: "$30"

            },
            {
                credits: "2500",
                price: "$60"
            },
            {
                credits: "5000",
                price: "$109"
            },
            {
                credits: "100",
                price: "$15"

            },
            {
                credits: "1000",
                price: "$35"
            },
            {
                credits: "2000",
                price: "$60"
            },
        ])
    },


})

// Emits
const emit = defineEmits(['close'])

// State
const prompt = ref<string | null>(null);


// Close the modal
const close = () => {
    emit('close');
    prompt.value = "";
};


const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
        close();
    }
}





</script>
<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 "
        @click="handleOutsideClick">


        <!--  More Credit Section -->
        <div class="bg-white rounded-lg shadow-md w-1/3">
            <div class="bg-tertiary p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-2xl text-black font-bold">My Credits:</h2>
                        <h2 class="text-2xl text-black font-bold">{{ cardTwo.credit }}</h2>
                        <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-1">
                    </div>
                    <div class="flex items-center ml-auto">
                        <img src="/public/images/zeuxis-logo.png" alt="Logo" class="h-10 bg-silverChalice">
                    </div>
                </div>

                <div class="flex flex-col space-y-1">
                    <p class="text-ravenBlack text-md font-bold">Credits Purchase</p>
                    <p class="text-silverChalice text-xs break-words">
                        Note: To enjoy subscriber benefits such as fast track, you must have an active subscription
                        plan;
                        buying
                        extra credits alone will not suffice. Credits expire in 2 years and are non-transferable and
                        non-refundable.
                    </p>
                    
                </div>
            </div>

            <!-- Cards Container -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 w-full">

          
                <div v-for="(feature, index) in props.cardArray"
                    class="bg-tertiary p-4 rounded-lg flex flex-col justify-between shadow-sm h-25 items-center">
                    <!-- Image on the left side -->
                    <div class="flex items-center justify-start w-full">
                        <img src="/public/images/icon/StartIcon.svg" alt="Start Icon" class="w-4 h-5 ml-2 mb-10 mr-2">
                       
                        <div class="flex flex-col items-center">
                            <p  class="text-3xl font-bold ">
            
                                {{ feature.credits }}
                            </p> 
                            <p class="text-end font-bold text-ravenBlack mt-2">{{ feature.price }}</p>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    </div>


</template>


<style scoped>
/* Optional styling adjustments */
</style>
