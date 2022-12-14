import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import * as React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { CircularProgress } from '@chakra-ui/react'

import { ErrorFallback } from '@/providers/ErrorFallback'
import { queryClient } from '@/lib/react-query'
import { Auth0ProviderWithRedirectCallback } from '@/lib/auth0/Auth0ProviderWithRedirectCallback'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '@/config'

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
        {import.meta.env.MODE === 'development' && <ReactQueryDevtools />}
        <BrowserRouter>
          <Auth0ProviderWithRedirectCallback
            domain={AUTH0_DOMAIN}
            clientId={AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
          >
            {children}
          </Auth0ProviderWithRedirectCallback>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.Suspense>
)
export default AppProvider
