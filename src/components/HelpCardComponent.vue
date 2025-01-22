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
    <div class="p-6 max-w-7xl mx-auto fixed">
        <!-- Title Section -->
        <h1 class="text-3xl sm:text-4xl font-bold text-center mt-10">Need Help?</h1>
        <p class="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Access helpful resources, detailed documentation, and the latest system updates.
        </p>

        <!-- Card Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            <div v-for="(card, index) in props.data.cards" :key="index"
                class="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-all duration-300">

                <!-- Icon & Title -->
                <div class="flex items-center space-x-3 mb-4">
                    <img src="/images/icon/helpBox.svg" class="h-10 w-10" alt="Zeuxis Logo"/>
                    <!-- <span class="bg-blue-500 text-white rounded-full p-2 flex items-center justify-center">
                        
                    </span> -->
                    <h3 class="text-lg font-semibold">{{ card.title }}</h3>
                </div>

                <!-- Description -->
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">{{ card.description }}</p>

                <!-- View More Link -->
                <a href="#" class="text-blue-600 font-medium hover:underline">View More</a>
            </div>
        </div>
    </div>
</template>
