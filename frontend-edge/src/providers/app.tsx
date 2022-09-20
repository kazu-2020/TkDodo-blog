import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClientProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import * as React from 'react'
import { Button, CircularProgress } from '@chakra-ui/react'

import { queryClient } from '@/lib/react-query'
// FIXME: Auth0を有効にするまで、コメントアウト
// import { Auth0ProviderWithRedirectCallback } from '@/lib/auth0/Auth0ProviderWithRedirectCallback'
// import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '@/config'

const ErrorFallback = () => (
  <div
    className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
    role="alert"
  >
    <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
    <Button
      className="mt-4"
      onClick={() => window.location.assign(window.location.origin)}
    >
      Refresh
    </Button>
  </div>
)

type AppProviderProps = {
  children: React.ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center w-screen h-screen">
        <CircularProgress size="xl" />
      </div>
    }
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
        <BrowserRouter>
          {/* // FIXME: Auth0を有効にするまで、コメントアウト */}
          {/* /!*<Auth0ProviderWithRedirectCallback*!/ */}
          {/* /!*  domain={AUTH0_DOMAIN}*!/ */}
          {/* /!*  clientId={AUTH0_CLIENT_ID}*!/ */}
          {/* /!*  redirectUri={window.location.origin}*!/ */}
          {/* /!*>*!/ */}
          {children}
          {/* </Auth0ProviderWithRedirectCallback> */}
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.Suspense>
)
export default AppProvider
