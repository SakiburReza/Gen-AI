import { createRouter, createWebHistory } from 'vue-router'
import OperativePage from '@/views/OperativePage.vue'
import SubscriptionPage from '@/views/SubscriptionPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AccountCard from '@/components/AccountCard.vue'
import InvoiceCard from '@/components/InvoiceCard.vue'
import VideoCarousel from '@/components/VideoCarousel.vue'
import BuyMoreCreditsModal from '@/components/BuyMoreCreditsModal.vue'
import { jwtDecode } from 'jwt-decode'
import VerificationPage from '@/views/VerificationPage.vue'
import SignInPage from '@/views/SignInPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'
import CommunitySidebar from '@/components/CommunitySidebar.vue'
import CommunityPage from '@/views/CommunityPage.vue'
import FeedbackPage from '@/views/FeedbackPage.vue'
import HelpPage from '@/views/HelpPage.vue'
import GalleryPage from '@/views/GalleryPage.vue'
import BoardAllImages from '@/views/BoardAllImages.vue'
import SavedBoardComponent from '@/components/SavedBoardComponent.vue'
import MainDemo from '@/konvaJsDemo/mainDemo.vue'
import KonvaEditor from '@/konvaJsDemo/KonvaEditor.vue'
import KonvaDocs from '@/konvaJsDemo/KonvaDocs.vue'
import DemoForKonva from '@/konvaJsDemo/DemoForKonva.vue'
import EditorPage from '@/views/EditorPage.vue'

export const isAuthenticated = () => {
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
      path: '/sign-in',
      name: 'signin',
      component: SignInPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUpPage,
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
    },
    {
      path: '/communitysidebar',
      name: 'communitysidebar',
      component: CommunitySidebar,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'communitypage',
      component: CommunityPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/feedbackpage',
      name: 'feedbackpage',
      component: FeedbackPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/help',
      name: 'help',
      component: HelpPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/gallerypage',
      name: 'gallerypage',
      component: GalleryPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/boardallimages',
      name: 'boardallimages',
      component: BoardAllImages,
      meta: { requiresAuth: true },
    },
    {
      path: '/savedboardcomponent',
      name: 'savedboardcomponent',
      component: SavedBoardComponent,
      meta: { requiresAuth: true },
    },
    {
      path: '/konva',
      name: 'MainDemo',
      component: MainDemo,
      meta: { requiresAuth: true },
    },
    {
      path: '/editor',
      name: 'KonvaEditor',
      component: KonvaEditor,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/app',
    //   path: '/konva2',
    //   name: 'KonvaDocs',
    //   component: KonvaDocs,
    //   meta: { requiresAuth: true },
    // },
    {
      path: '/konva2',
      name: 'KonvaDocs',
      component: KonvaDocs,
      meta: { requiresAuth: true },
    },
    {
      path: '/konva3',
      name: 'DemoForKonva',
      component: DemoForKonva,
      meta: { requiresAuth: true },
    },
    {
      path: '/editorPage',
      name: 'editorPage',
      component: EditorPage,
      meta: { requiresAuth: false },

    },

  ],
})
// router.beforeEach((to, from, next) => {
//   const loggedIn = isAuthenticated();

//   if (to.meta.requiresAuth && !loggedIn) {
//     next('/'); // Redirect to login page
//   } else if ((to.path === '/' || to.path === '/sign-up') && loggedIn) {
//     next('/operativepage'); // Redirect logged-in users to dashboard/home
//   } else {
//     next(); // Proceed to the requested route
//   }
// });

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();
  const firstVisit = sessionStorage.getItem("lastVisit") === null;

  if (!loggedIn) {
    if (firstVisit && to.path === "/") {
      sessionStorage.setItem("lastVisit", "/");
      localStorage.setItem('selectedMenu', '/')
      next("/");
    } else if (to.meta.requiresAuth) {
      next("/sign-in");
    } else {
      next();
    }
  } else {
    if (to.path === "/sign-in" || to.path === "/sign-up") {
      next("/");
    } else {
      next();
    }
  }
});




export default router
