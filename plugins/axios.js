export default function({ $axios, store }) {
  $axios.onRequest(config => {
    return config
  })

  $axios.onResponse(response => {
    store.dispatch('loading/succeedLoading')
    return Promise.resolve(response)
  })

  $axios.onError(err => {
    store.dispatch('loading/failLoading')
    return Promise.reject(err)
  })

  $axios.onRequestError(err => {
    store.dispatch('loading/failLoading')
    return Promise.reject(err)
  })

  $axios.onResponseError(err => {
    store.dispatch('loading/failLoading')
    return Promise.reject(err)
  })
}
