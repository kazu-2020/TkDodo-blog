import { useNavigate } from 'react-router-dom'
import React, { ReactNode } from 'react'
import {
  AppState,
  Auth0Provider,
  Auth0ProviderOptions
} from '@auth0/auth0-react'

export const Auth0ProviderWithRedirectCallback = ({
  children,
  ...props
}: {
  children: ReactNode
} & Auth0ProviderOptions) => {
  const navigate = useNavigate()
  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate((appState && appState.returnTo) || window.location.pathname)
  }
  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  )
}
