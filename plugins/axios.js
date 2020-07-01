export default function({ $axios }) {
  $axios.onRequest(config => {
    return config
  })

  $axios.onResponse(response => {
    return Promise.resolve(response)
  })

  $axios.onError(err => {
    return Promise.reject(err.response)
  })

  $axios.onRequestError(err => {
    return Promise.reject(err.response)
  })

  $axios.onResponseError(err => {
    return Promise.reject(err.response)
  })
}
