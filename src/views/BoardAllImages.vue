<script setup>
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { imageUrl } from '@/utils/utils'
import { onMounted, ref } from 'vue'
import genAiService from '@/services/gen-ai'
import { useRoute } from 'vue-router'

const images  = ref([])
const route = useRoute()
const board = route.query.board





onMounted(() => {
  boardImagesByName()
  collaborateBoardImagesByName()
})

const boardImagesByName = async () => {
  
  try {
    const response = await genAiService.getBoardImagesByName(board)
    if (response.data.data?.length) {
      images.value = response.data.data[0].images || [] 
    }
  } catch (error) {
    console.error('Error fetching board images:', error)
  }
}

const collaborateBoardImagesByName = async () => {
  
  try {
    const response = await genAiService.getCollaborateBoardsInfo(board)
    if (response.data.data?.length) {
      images.value = response.data.data[0].images || [] 
    }
  } catch (error) {
    console.error('Error fetching board images:', error)
  }
}


</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-8 gap-2 p-2">
        <img
        v-for="(img, index) in images"
        :key="index"
        class="rounded-lg border cursor-pointer w-50 h-50"
        :src="imageUrl() + img.content"
        alt="Board Image"
      />
    </div>
  </DefaultLayout>
</template>
