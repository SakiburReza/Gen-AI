import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import DescriptionCard from '@/components/DescriptionCard.vue'
import CustomizationCard from '@/components/CustomizationCard.vue'
import TextToImage from '@/views/TextToImage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TextToImage,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
