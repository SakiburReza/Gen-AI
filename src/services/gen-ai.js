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
      headers: this.getAuthHeaders(),
    });

  }

  saveProfile(data) {
    return axios.post(this.url +'/user/user-profile-update', data,{
      headers: this.getAuthHeaders(),
    });

  }
}

export default new GenAIService()
