import axios from 'axios'

class GenAIService {
  constructor() {
    this.url = import.meta.env.VITE_API_URL
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken') // Fetch the token from localStorage
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  textToImage(reqData) {
    return axios.post(this.url + '/text-to-image', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  textToVideo(reqData) {
    return axios.post(this.url + '/text-to-video', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  getMedia(params) {
    return axios.get(this.url + '/get-images?type=' + params, {
      headers: this.getAuthHeaders(),
    })
  }

  faceSwap(reqData) {
    return axios.post(this.url + '/swap-to-image', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  imageToVideo(reqData) {
    return axios.post(this.url + '/image-to-video', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  imageToImage(reqData) {
    return axios.post(this.url + '/image-to-image', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  templateVideo(reqData) {
    return axios.post(this.url + '/template-video', reqData, {
      headers: this.getAuthHeaders(),
    })
  }

  fetchTemplateVideo() {
    return axios.get(this.url + '/get-template-video', {
      headers: this.getAuthHeaders(),
    })
  }

  register(reqData) {
    return axios.post(this.url + '/user/register', reqData)
  }

  logIn(reqData) {
    return axios.post(this.url + '/user/login', reqData)
  }
  getCreditInfo() {
    return axios.get(this.url + '/user/creditInfo', {
      headers: this.getAuthHeaders(),
    })
  }
  fetchSubscribePlan() {
    return axios.get(this.url + '/subscribePlanInfo', {
      headers: this.getAuthHeaders(),
    })
  }

  subscribePackages(subscribePackage, recurringConfirmation, recurringCadence) {
    return axios.post(
      this.url +
        `/checkoutSubscribe?subscribePackage=${subscribePackage}&recurringConfirmation=${recurringConfirmation}&recurringCadence=${recurringCadence}`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    )
  }
  getPaymentSync(checkoutId, transactionId) {
    return axios.get(
      this.url + `/square/paymentDetails?checkoutId=${checkoutId}&transactionId=${transactionId}`,
      {
        headers: this.getAuthHeaders(),
      },
    )
  }

  fetchUserProfile() {
    return axios.get(this.url +'/user/user-profile', {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`,
      },
    });

  }

  saveProfile(data) {
    return axios.post(this.url +'/user/user-profile-update', data,{
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`,
      },
    });

  }
}

export default new GenAIService()
