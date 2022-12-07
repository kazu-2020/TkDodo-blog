export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL as string
export const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN as string
export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID as string
export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string
export const REACT_APP_API_MOCKING = import.meta.env
  .VITE_REACT_APP_API_MOCKING as string

const OKTA_CLIENT_ID = import.meta.env.VITE_OKTA_CLIENT_ID as string
const OKTA_ISSUER = import.meta.env.VITE_OKTA_ISSUER as string

export const OIDC_CONFIG =   {
  clientId: OKTA_CLIENT_ID,
    issuer: OKTA_ISSUER,
    redirectUri: `${window.location.origin}/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: import.meta.env.OKTA_TESTING_DISABLEHTTPSCHECK || false,
}
