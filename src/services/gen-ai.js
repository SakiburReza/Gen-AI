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

  getMedia(params) {
    return axios.get(this.url + '/get-images?type=' + params, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  faceSwap(reqData) {
    return axios.post(this.url + '/swap-to-image', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  imageToVideo(reqData) {
    return axios.post(this.url + '/image-to-video', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  imageToImage(reqData) {
    return axios.post(this.url + '/image-to-image', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  templateVideo(reqData) {
    return axios.post(this.url + '/template-video', reqData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  fetchTemplateVideo() {
    return axios.get(this.url + '/get-template-video', {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJsYXN0QWNjZXNzZWQiOjE3MzM2MzgzNjA5NzEsInVzZXJJZCI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MzM2MzgzNjAsImV4cCI6MTczNzUyNjM2MH0.9GV87RADi9vuVBAoXIfRcvXhQDEQfJN-IdrLZbu5jCB7eL2Qjr_Y-vGLdhLyMOo5cVJhkWmBZe_yy9grRH-jQA`, // Add the token here
      },
    })
  }

  register(reqData) {
    return axios.post(this.url + '/user/register', reqData)
  }

  logIn(reqData) {
    return axios.post(this.url + '/user/login', reqData)
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
