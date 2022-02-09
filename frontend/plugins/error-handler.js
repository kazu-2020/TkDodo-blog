// import Vue from 'vue'

// export default (context, _inject) => {
//   Vue.config.errorHandler = (error, _vm, _info) => {
//     const message = error.stack
//     errorHandler(message)
//   }

//   window.addEventListener('error', (event) => {
//     const message = event.error.stack
//     errorHandler(message)
//   })

//   window.addEventListener('unhandledrejection', (event) => {
//     const message =
//       'Unhandled Rejection at: Promise' + event.p + 'reason:' + event.reason
//     errorHandler(message)
//   })

//   context.$axios.onError((error) => {
//     if (error.response) {
//       switch (error.response?.status) {
//         case 400:
//         case 401:
//         case 403:
//         case 500:
//         case 502:
//         case 503:
//         case 504:
//           errorHandler(`${error.request.responseURL}\n${error.stack}`)
//           break
//       }
//     }
//   })

//   function errorHandler(message) {
//     const data = {
//       text: message + `\n Error occured at "${context.route.fullPath}"`,
//     }
//     context.$axios.post('/slack/incoming_webhook', JSON.stringify(data))
//   }
// }
