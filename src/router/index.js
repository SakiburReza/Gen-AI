import { createRouter, createWebHistory } from 'vue-router'
import OperativePage from '@/views/OperativePage.vue'
import SignInComponent from '@/components/SignInComponent.vue'
import SignUpComponent from '@/components/SignUpComponent.vue'
import SubscriptionPage from '@/views/SubscriptionPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AccountCard from '@/components/AccountCard.vue'
import InvoiceCard from '@/components/InvoiceCard.vue'
import SubscriptionBillingCard from '@/components/SubscriptionBillingCard.vue'
import TemplatesCard from '@/components/TemplatesCard.vue'


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
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: SubscriptionPage,
    },
    {
      path: '/subscription-billing',
      name: 'subscriptionbilling',
      component: SubscriptionBillingCard,
    },
    {
      path: '/accountcard',
      name: 'accountcard',
      component: AccountCard,
    },

    {
      path: '/invoicecard',
      name: 'invoicecard',
      component: InvoiceCard
    },

    {
      path: '/template',
      name: 'template',
      component: TemplatesCard
    }

  ],
})

export default router
