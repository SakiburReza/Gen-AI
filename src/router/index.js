import { createRouter, createWebHistory } from 'vue-router'
import TextToImage from '@/views/TextToImage.vue'
import FaceSwap from '@/views/FaceSwap.vue'
import FacilityCard from '@/components/FacilityCard.vue'
import OperativePage from '@/views/OperativePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OperativePage,
    }
   
  ],
})

export default router
