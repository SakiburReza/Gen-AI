<script setup >
import { ref, computed, onMounted} from 'vue';
import DemoForKonva from '@/konvaJsDemo/DemoForKonva.vue';
import DefaultLayout from '@/layout/DefaultLayout.vue';
import genAiService from '@/services/gen-ai'
import { imageUrl } from '@/utils/utils'

const media = ref([])   



const fetchMedia = async () => {
  const label = 'text-to-image'
    const response = await genAiService.getMedia(label)
      media.value = response.data.data
      console.log('media', media.value)
}
  

onMounted(() => {
  fetchMedia()
})

</script>

<template>
    <DefaultLayout :showBadge="showBadge">
    <div class="grid grid-cols-2 gap-4">
        <div>
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 rounded-t-2xl overflow-y-auto">
          <div v-for="(item, index) in media" :key="index" class="relative overflow-hidden group" :class="[
            item.orientation === 'P' ? 'row-span-2' : 'row-span-1',
            'shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 min-h-40 max-h-100',
          ]"><!-- Render Image -->

            <img v-if="item.type === 'image'" v-lazy="imageUrl() + item.content"
              :alt="'Media ' + index" class="h-full max-w-full w-full" :class="[
                item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]',
                'object-cover',
              ]" @click="onImageClick(media[index])" />
              </div>

            </div>
          </div>
        <div> 
            <DemoForKonva />    
        </div>
    </div>
    
    </DefaultLayout>
   

</template>