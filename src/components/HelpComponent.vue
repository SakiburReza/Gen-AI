<script setup>
import { FwbCard } from 'flowbite-vue'
import CommunitySidebar from '@/components/CommunitySidebar.vue'

</script>

<template>
    <fwb-card href="#">
        <div class="p-5">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-red dark:text-white">
                Noteworthy technology acquisitions 2021
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
        </div>
    </fwb-card>

    <!-- Sidebar Section -->
    <!-- <div class="w-full md:w-64 md:ml-5 mt-5 md:mt-0 flex justify-center md:flex-none rounded-3xl">
        <div class="w-80 rounded-3xl overflow-hidden">
            <CommunitySidebar class="w-full" />
        </div>
    </div> -->
</template>
