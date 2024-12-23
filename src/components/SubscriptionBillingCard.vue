<script setup lang="ts">
import { ref } from 'vue';
import ShowModalForImage from './ShowModalForImage.vue';

const props = defineProps({
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
    cardThree: {
        type: Object,
        default: () => ({
            price: "$20.00/month",
            billingDate: "Jan. 11, 2025"
        })
    }
});


// State for modal visibility
const showModal = ref(false);

// Functions to open/close modal
const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const images = "/public/images/carImage.png"


</script>
<template>
    <div class="p-8 max-w-6xl mx-auto">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold mb-4">Billing</h1>
            <!-- Button Hidden on Mobile and Shown on Medium Screens and Above -->
            <button @click="() => $router.push('/')"
                class="hidden md:inline-block mb-5 bg-blue-600 text-white px-6 py-4 rounded-lg text-sm">
                TAKE ME BACK I WANT TO CREATE
            </button>
        </div>
        <!--  Subscription Section -->
        <div class="bg-lightWhite p-6 rounded-lg shadow-md">
            <h2 class="text-2xl text-silverChalice mb-4">Your Subscription</h2>



            <!-- Cards Container -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <!-- Next Up Creator Card -->
                <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
                    <div>
                        <h3 class="text-xl font-semibold mb-1">{{ cardOne.title }}</h3>
                        <div class="flex items-center justify-between">
                            <p class="text-silverChalice mb-4 text-sm">Monthly</p>
                            <p class="text-md flex items-center text-silverChalice">
                                <img src="/public/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2 ">
                                {{ cardOne.credit }}
                            </p>
                        </div>
                        <br>
                        <div class="border-solid lg:border-dashed">
                            <p>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - </p>
                        </div> <br>
                        <div class="flex items-center justify-between">
                            <p class="text-xs text-silverChalice mt-2">Plan renews on {{ cardOne.date }}</p>
                            <button
                                class="text-sm bg-ravenBlack text-white px-4 py-2 rounded-2xl hover:bg-ravenBlack whitespace-nowrap">
                                Change Plan
                            </button>
                        </div>

                    </div>

                </div>

                <!-- Purchased Credits Card -->
                <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
                    <div>
                        <h3 class="text-xl font-semibold mb-1">Purchased</h3>
                        <div class="flex items-center justify-between">
                            <p class="text-silverChalice mb-4 text-sm">Credits</p>
                            <p class="text-md flex items-center text-silverChalice">
                                <img src="/public/images/icon/StartIcon.svg" alt="" class="w-5 h-5 mr-2">
                                {{ cardTwo.credit }}
                            </p>
                        </div>
                        <br>
                        <p>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - </p>
                        <br>
                        <div class="flex items-center justify-between">
                            <p class="text-xs text-silverChalice mt-1">Expires 2 years from date purchased</p>
                            <button
                                class="text-sm bg-ravenBlack text-white px-4 py-2 rounded-2xl hover:bg-ravenBlack whitespace-nowrap">
                                Buy More
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Invoices Card -->
                <div class="bg-tertiary p-6 rounded-lg flex flex-col justify-between shadow-sm">
                    <div>
                        <h3 class="text-xl font-semibold mb-1">Invoices</h3>

                        <br><br><br>
                        <p>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - </p>

                        <div class="flex items-center justify-between">
                            <p class="text-silverChalice mb-2 text-sm">Price</p>
                            <p class="font-bold text-lg">{{ cardThree.price }}</p>
                        </div>
                        <div class="flex items-center justify-between">
                            <p class="text-silverChalice mb-2 text-sm">Billing date </p>
                            <p class="font-bold text-md">{{ cardThree.billingDate }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- Button Shown Only on Mobile -->
        <div class="md:hidden mt-6">
            <button @click="() => $router.push('/')" class="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-sm">
                TAKE ME BACK I WANT TO CREATE
            </button>
        </div>
        <br>
        <div @click="openModal">
            <img :src="images" alt="Images">
        </div>
        <ShowModalForImage :isOpen="showModal" @close="closeModal" :image="images" />
    </div>


</template>
<style scoped></style>
