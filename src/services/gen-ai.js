import axios from 'axios'

class GenAIService {
  constructor() {
    this.url = import.meta.env.VITE_API_URL
  }

  textToImage(reqData) {
    return axios.post(this.url + '/text-to-image', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
  textToVideo(reqData) {
    return axios.post(this.url + '/text-to-video', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
  getImages(params){
    return axios.get(this.url+'/get-images?type='+params, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
  faceSwap(reqData){
    return axios.post(this.url+'/swap-to-image',reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
  imageToVideo(reqData){
    return axios.post(this.url+'/image-to-video',reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
  imageToImage(reqData){
    return axios.post(this.url+'/image-to-image',reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }
}

export default new GenAIService()
