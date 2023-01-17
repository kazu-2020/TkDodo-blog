import { Outlet } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import { toRelativeUrl } from '@okta/okta-auth-js'

import Loading from '@/lib/okta/components/Loading'

export const RequiredAuth = () => {
  const { oktaAuth, authState } = useOktaAuth()

  useEffect(() => {
    if (!authState) {
      return
    }

    if (!authState?.isAuthenticated) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin
      )
      oktaAuth.setOriginalUri(originalUri)
      oktaAuth.signInWithRedirect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oktaAuth, !!authState, authState?.isAuthenticated])

  if (!authState || !authState?.isAuthenticated) {
    return <Loading />
  }

  return <Outlet />
}
