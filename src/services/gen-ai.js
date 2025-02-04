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
    return axios.get(this.url + '/get-media?type=' + params, {
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
    console.log('no package found');
    
    return axios.post(
      this.url +
        `/checkoutSubscribe?subscribePackage=${subscribePackage}&recurringConfirmation=${recurringConfirmation}&recurringCadence=${recurringCadence}`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    )
  }
  
  changesubscribePackages(subscribePackage) {
    console.log('package change');
    
    return axios.get(
      this.url +
        `/changeSubscriptionPlan?subscribePackage=${subscribePackage}`,
      {
        headers: this.getAuthHeaders(),
      },
    )
  }
  // getPaymentSync(checkoutId, transactionId) {
  //   return axios.get(
  //     this.url + `/square/paymentDetails?checkoutId=${checkoutId}&transactionId=${transactionId}`,
  //     {
  //       headers: this.getAuthHeaders(),
  //     },
  //   )
  // }
  getPaymentSync() {
    return axios.get(this.url + `/square/paymentDetails`, {
      headers: this.getAuthHeaders(),
    })
  }

  fetchUserProfile() {
    return axios.get(this.url + '/user/user-profile', {
      headers: this.getAuthHeaders(),
    })
  }

  saveProfile(data) {
    return axios.post(this.url + '/user/user-profile-update', data, {
      headers: this.getAuthHeaders(),
    })
  }
  fetchPaymentInfo() {
    return axios.get(this.url + '/paymentInfo', {
      headers: this.getAuthHeaders(),
    })
  }
  checkOTP(email, otp) {
    return axios.get(this.url + `/user/check-otp?email=${email}&otp=${otp}`)
  }
  billingInformation() {
    return axios.get(this.url + '/billingInfo', {
      headers: this.getAuthHeaders(),
    })
  }
  getCommunityMedia() {
    return axios.get(this.url + '/share/communityImage')
  }

  shareImage(data) {
    return axios.post(this.url + '/share-image', data, {
      headers: this.getAuthHeaders(),
    })
  }
  likeImage(data) {
    return axios.post(this.url + '/like-image', data, {
      headers: this.getAuthHeaders(),
    })
  }
  cancelSubscription() {
    return axios.get(this.url + `/cancelSubscription`, {
      headers: this.getAuthHeaders(),
    })
  }
  getLikedMedia(params) {
    return axios.get(this.url + '/get-liked-media?type=' + params, {
      headers: this.getAuthHeaders(),
    })
  }
  deleteMedia(params) {
    return axios.get(this.url + '/delete-image/' + params, {
      headers: this.getAuthHeaders(),
    })
  }
  saveFeedback(data) {
    return axios.post(this.url + '/user/feedback', data, {
      headers: this.getAuthHeaders(),
    })
  }

  //get all boards name and images
  getBoardsInfo() {
    return axios.get(this.url + '/user/getBoards', {
      headers: this.getAuthHeaders(),
    })
  }
  getCollaborateBoardsInfo(boardName) {
    const uri = boardName != null ? '/user/getCollaborateBoards?boardName=' + boardName: '/user/getCollaborateBoards';
    return axios.get(this.url + uri,  {
      headers: this.getAuthHeaders(),
    })
  }

getBoardImagesByName(boardName) {
  return axios.get(this.url + '/user/getBoards?boardName=' + boardName, {
    headers: this.getAuthHeaders(),
  })
}

searchCollabarator(searchData) {
  return axios.get(this.url + '/user/searchCollaborator?collaborator=' + searchData, {
    headers: this.getAuthHeaders(),
  })
}
createBoard(data) {
  return axios.post(this.url + '/user/assignBoard', data, {
    headers: this.getAuthHeaders(),
  })
}
saveBoardImages(data) {
  return axios.post(this.url + '/user/assignBoardImage', data, {
    headers: this.getAuthHeaders(),
  })
}



}
export default new GenAIService()
