import './assets/css/main.css'
import '../node_modules/flowbite-vue/dist/index.css'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { toast } from 'vue3-toastify'
import axios from 'axios'
import VueLazyload from 'vue3-lazyload';
import App from './App.vue'
import router from './router'
import VueKonva from 'vue-konva';


const app = createApp(App)
app.use(VueLazyload, {
  loading: 'loading-placeholder.png',  
  error: 'error-placeholder.png'    
});
const pinia = createPinia();
app.use(pinia);  // Only use pinia once here.
app.use(VueKonva)
app.use(router)


// app.use(createPinia());
app.use(Vue3Toastify, {
  autoClose: 3000,
  hideProgressBar: true,
  transition: 'slide',
  style: {
    zIndex: '9999999'
  }
})

app.mount('#app')

const axiosInstance = axios.create();
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Register axiosInstance globally
app.config.globalProperties.$axios = axiosInstance;

// Request interceptor for API calls
// axiosInstance.interceptors.request.use(
//   (config) => {

//     // Retrieve the token inside the interceptor to ensure the latest value
//     const token = localStorage.getItem('authToken');

//     if (token) {
//       config.headers.Authorization = Bearer ${token}; // Add token to request headers
//     } else {
//       // Optionally, redirect to login page if needed:
//       // router.push('/login');
//     }

//     return config; // Return config to continue with the request
//   },
//   (error) => {
//     return Promise.reject(error); // Handle request error
//   }
// );



axios.interceptors.response.use(
  (config) => {
    if (config.data.status === false) {
      toast.error(config.data.message, {
        autoClose: 2500,
        theme: 'dark',
        closeOnClick:true
      })
    }
    // else {
    //   toast.success(config.data.message, {
    //     autoClose: 2500,
    //     theme: 'dark'
    //   })
    // }
    return config
  },
  (error) => {
    if (error.code == 'ERR_NETWORK') {
      setTimeout(() => {
        toast.error('Connection refused. Please check your network and try again.', {
          autoClose: 2500,
          theme: 'dark'
        })
      }, 100)

      // Redirect to the login page
    } if(error.response.data.message === 'YOUR TOKEN HAS EXPIRED, PLEASE LOGIN AGAIN'){
      toast.error(
      error.response.data.message != null ? error.response.data.message : error.message,
        {
          autoClose: 2500,
          theme: 'dark'
        }
      )
        setTimeout(() => {
          localStorage.removeItem('authToken');
          router.push('/sign-in');
      }, 1500);

    } else if (error.message) {
      toast.error(
        error.response.data.message != null ? error.response.data.message : error.message,
        {
          autoClose: 2500,
          theme: 'dark'
        }
      )
        
    } else {
      toast.error('Something went wrong!', {
        autoClose: 2500,
        theme: 'dark'
      })
    }
    // if (error.response.status == 401) {
    //   const errMsg = error.response.data.message
    //   toast.error(errMsg, {
    //     theme: 'dark',
    //     onClose: () => {
    //       //authService.logout()
    //     },
    //   })
    // }
    return Promise.reject(error)
  }
)

app.config.errorHandler = (err) => {
  toast.error(err.message, {
    autoClose: 2500,
    theme: 'dark'
  })
}
