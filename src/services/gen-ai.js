import axios from 'axios'

class GenAIService {
  constructor() {
    this.url = import.meta.env.VITE_API_URL
  }

  getAiGeneratedImage(reqData) {
    return axios.post(this.url + '/text-to-image', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzMzNzE3ODQzNTIsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzMzNzE3ODQsImV4cCI6MTczMzQ1ODE4NH0.pfdQ-4syK6_pcA1fKJV0wiqSS_iKX3avWcgiklUe5jd7Xb-Ldo1FkplZMRHsTBycdGJBuSFvxsCeLGiuFhvRkw`, // Add the token here
      },
    })
  }
  getImages(params){
    return axios.get(this.url+'/get-images?type='+params, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzMzOTE2MjMzMzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzMzOTE2MjMsImV4cCI6MTczMzQ3ODAyM30.bqXtbAZ5jDBtVnlU9GJw2642rfPLg2CGHoI8Ro61tcknFRhyqPlU1hQ91PA-nxRV2wo75v8k10un50TrjB384A`, // Add the token here
      },
    })
  }
}

export default new GenAIService()
