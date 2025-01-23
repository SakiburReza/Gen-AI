<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => ({
        }),
    },
});
</script>

<template>
    <div class="max-w-5xl lg:px-4">
        <!-- Title Section -->
        <h1 class="text-2xl sm:text-xl font-bold text-center mt-10 mb-1">Need Help?</h1>
        <p class="text-center text-gray-500 mb-10 max-w-sm mx-auto text-md">
            Access helpful resources, detailed documentation, and the latest system updates.
        </p>

        <!-- Scrollable Card Grid Container max-h-[calc(100vh-150px)] sm:w-[250px] md:w-[280px] lg:w-[300px] h-[250px]-->
        <div class="">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="(card, index) in props.data.cards" :key="index" class="bg-white shadow-lg rounded-md p-5 hover:shadow-2xl transition-all duration-300 
                       w-full  flex flex-col">

                    <img src="/images/icon/helpBox.svg" class="h-10 w-10" alt="Zeuxis Logo" />

                    <!-- Icon & Title -->
                    <div class="flex items-center space-x-2 mb-1 pt-5">
                        <h3 class="text-md font-semibold">{{ card.title }}</h3>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-600 text-sm mb-4 flex-1 line-clamp-3 overflow-hidden">
                        {{ card.description }}
                    </p>

                    <!-- View More Link -->
                    <a href="#" class="text-blue-600 font-medium hover:underline text-md">View More</a>
                </div>
            </div>
        </div>
    </div>


</template>
