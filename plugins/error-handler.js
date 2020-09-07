import Vue from 'vue'

export default (context, _inject) => {
  Vue.config.errorHandler = (error, vm, info) => {
    handler(error, vm, info)
  }

  window.addEventListener('error', (event) => {
    handler2(event.error)
  })

  window.addEventListener('unhandlerejection', (event) => {
    handler2(event.reason)
  })

  context.$axios.onError((error) => {
    switch (error.response.status) {
      case 400:
      case 401:
      case 403:
      case 500:
      case 502:
      case 503:
      case 504:
        console.log(error)
        console.log(error.request.responseURL)
        break
    }
  })

  function handler(error, _vm, _info) {
    console.log(error)
  }

  function handler2(error) {
    console.log(error)
  }
}
