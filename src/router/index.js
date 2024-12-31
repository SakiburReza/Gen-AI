import { createRouter, createWebHistory } from 'vue-router'
import OperativePage from '@/views/OperativePage.vue'
import SignInComponent from '@/components/SignInComponent.vue'
import SignUpComponent from '@/components/SignUpComponent.vue'
import SubscriptionPage from '@/views/SubscriptionPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AccountCard from '@/components/AccountCard.vue'
import InvoiceCard from '@/components/InvoiceCard.vue'
import VideoCarousel from '@/components/VideoCarousel.vue'
import BuyMoreCreditsModal from '@/components/BuyMoreCreditsModal.vue'
import {jwtDecode } from 'jwt-decode'
import VerificationPage from '@/views/VerificationPage.vue'

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken'); // Replace with your token key
  if (!token) {
    return false; // No token found
  }

  try {
    const decoded = jwtDecode(token); // Decode the token
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp && decoded.exp > currentTimestamp) {
      return true; // Token is valid and not expired
    }
    return false; // Token is expired
  } catch (error) {
    console.error('Invalid token:', error);
    return false; // Invalid token format
  }
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/operativepage',
      name: 'operativepage',
      component: OperativePage,
       meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'signin',
      component: SignInComponent,
      meta: { requiresAuth: false },
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUpComponent,
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
       meta: { requiresAuth: true },
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: SubscriptionPage,
       meta: { requiresAuth: true },
    },
    // {
    //   path: '/subscription-billing',
    //   name: 'subscriptionbilling',
    //   component: SubscriptionBillingCard,
    // },
    {
      path: '/accountcard',
      name: 'accountcard',
      component: AccountCard,
       meta: { requiresAuth: true },
    },
    {
      path: '/morecredit',
      name: 'morecredit',
      component: BuyMoreCreditsModal,
       meta: { requiresAuth: true },
    },

    {
      path: '/invoicecard',
      name: 'invoicecard',
      component: InvoiceCard,
       meta: { requiresAuth: true },
    },

    {
      path: '/template',
      name: 'template',
      component: VideoCarousel,
       meta: { requiresAuth: true },
    },
    {
      path: '/verification',
      name: 'verification',
      component: VerificationPage,
       meta: { requiresAuth: true },
    }

  ],
});
router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) {
    console.log("log?", loggedIn);
    next('/'); // Redirect to login page
  } else if ((to.path === '/' || to.path === '/sign-up') && loggedIn) {
    next('/operativepage'); // Redirect logged-in users to dashboard/home
  } else {
    next(); // Proceed to the requested route
  }
});

export default router