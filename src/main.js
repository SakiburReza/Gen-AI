import './assets/css/main.css'
import '../node_modules/flowbite-vue/dist/index.css'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { toast } from 'vue3-toastify'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
app.use(createPinia());
app.use(Vue3Toastify, {
    autoClose: 3000,
    hideProgressBar: true,
    transition: 'slide',
    style: {
      zIndex: '9999999'
    }
  })
  
  
  const axiosInstance = axios.create()
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

app.config.globalProperties.$axios = axiosInstance

let userData = JSON.parse(localStorage.getItem('user'))

//----------------------------------------Request interceptor for API calls-------------------------

axios.interceptors.request.use(
  (config) => {
    if (!(config.params && config.params.dontLoad === true)) {
      //   loaderStore.setShowLoader(true)
      // loaderStore.setIsLoading(true)
    } else {
      config.params.dontLoad = null
    }
    if (!userData) {
      userData = JSON.parse(localStorage.getItem('user'))
    }
    if (userData) {
      config.headers.Authorization = `Bearer ${userData.token}`
    }
    return config
  },
  (error) => {
    toast.error('Something went wrong!', {
      autoClose: 2500,
      theme: 'dark'
    })
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (config) => {
    if (config.data.status === false) {
      toast.error(config.data.message, {
        autoClose: 2500,
        theme: 'dark'
      })
    }
    // else {
    //   console.log('true', config.data)
    //   toast.success(config.data.message, {
    //     autoClose: 2500,
    //     theme: 'dark'
    //   })
    // }
    return config
  },
  (error) => {
    console.log(error)
    if (error.code == 'ERR_NETWORK') {
      router.push({ name: 'userLogin' })
      setTimeout(() => {
        toast.error('Connection refused. Please check your network and try again.', {
          autoClose: 2500,
          theme: 'dark'
        })
      }, 100)

      // Redirect to the login page
    } else if (error.message) {
      console.log(error)
      toast.error(
        error.response.data.message != null ? error.response.data.message : error.response.data,
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
    if (error.response.status == 401) {
      const errMsg = error.response.data.message
      toast.error(errMsg, {
        theme: 'dark',
        onClose: () => {
            //authService.logout()
        },
      })
    }
    return Promise.reject(error)
  }
)

app.config.errorHandler = (err) => {
  toast.error(err.message, {
    autoClose: 2500,
    theme: 'dark'
  })
}
