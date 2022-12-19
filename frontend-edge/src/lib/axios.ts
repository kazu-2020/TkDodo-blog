import Axios, { AxiosRequestConfig } from 'axios'
import { OktaAuth } from '@okta/okta-auth-js'

import { API_BASE_URL, OIDC_CONFIG } from '@/config'

function authRequestInterceptor(config: AxiosRequestConfig) {
  const oktaAuth = new OktaAuth(OIDC_CONFIG)
  const accessToken = oktaAuth.getAccessToken()

  return {
    ...config,
    headers: {
      ...config.headers,
      authorization: `${accessToken}`,
      Accept: 'application/json'
    }
  }
}

const axios = Axios.create({
  baseURL: API_BASE_URL
})

axios.interceptors.request.use(authRequestInterceptor)

export default axios
