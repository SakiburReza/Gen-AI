<script setup>
const openInNewTab = () => {
    window.open("https://qnb3y.csb.app/", "_blank", "noopener,noreferrer");
};
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <button @click="openInNewTab" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
            Click to edit
        </button>
    </div>
</template>
