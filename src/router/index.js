import { createRouter, createWebHistory } from 'vue-router'
import OperativePage from '@/views/OperativePage.vue'
import SignInComponent from '@/components/SignInComponent.vue'
import SignUpComponent from '@/components/SignUpComponent.vue'
import PhotoDetailsCard from '@/components/PhotoDetailsCard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OperativePage,
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignInComponent,
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUpComponent,
    },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: ProfilePage,
    // },
    // {
    //   path: '/subscription',
    //   name: 'subscription',
    //   component: SubscriptionPage,
    // }
    {
      path: '/s',
      name: 's',
      component: PhotoDetailsCard,
    },
   
  ],
})

export default router
