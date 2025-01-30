<script setup>
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { imageUrl } from '@/utils/utils'
import { onMounted, ref } from 'vue'
import genAiService from '@/services/gen-ai'
import { useRoute } from 'vue-router'
import PreviewImageModal from '@/components/PreviewImageModal.vue'

const images = ref([])
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
//Functions to open/close modal
const showPreviewModal = ref(false)
const selectedImage = ref(null) 
const closePreviewModal = () => {
  showPreviewModal.value = false
  selectedImage.value = null
}
const openPreviewModal = (mediaItem) => {
  selectedImage.value = mediaItem
  showPreviewModal.value = true
}
</script>

<template>
  <DefaultLayout>
    <div
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 rounded-t-2xl overflow-y-auto"
    >
      <div
        v-for="(item, index) in images"
        :key="index"
        class="relative overflow-hidden group"
        :class="[item.orientation === 'P' ? 'row-span-2' : 'row-span-1']"
      >
        <!-- Render Image -->
        <img
          :src="imageUrl() + item.imageKey"
          :alt="'Media ' + index"
          class="h-full max-w-full w-full object-cover"
          :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]']"
          @click="openPreviewModal(item)"
        />
      </div>
    </div>
      <!-- Modal Component -->
      <PreviewImageModal
      :isOpen="showPreviewModal"
      @close="closePreviewModal"
      :image="selectedImage"
    />
  </DefaultLayout>
</template>
