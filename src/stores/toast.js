import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const useToastStore = defineStore('toast', {
  state: () => ({}),
  actions: {
    success(message) {
      toast.success(message, {
        autoClose: 2500,
        theme: 'dark'
      })
    },
    error(message) {
      toast.error(message, {
        autoClose: 2500,
        theme: 'dark'
      })
    },
    showSuccessToast(message) {
      toast.success(message, {
        autoClose: false,
        theme: 'dark'
      })
    },
  }
})


