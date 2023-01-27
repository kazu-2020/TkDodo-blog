import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import * as React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider, Spinner } from '@chakra-ui/react'

import { ErrorFallback } from '@/providers/ErrorFallback'
import theme from '@/lib/theme'
import { queryClient } from '@/lib/react-query'

type AppProviderProps = {
  children: React.ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center w-screen h-screen">
        <Spinner size="xl" />
      </div>
    }
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          {import.meta.env.MODE === 'development' && <ReactQueryDevtools />}
          <BrowserRouter>{children}</BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.Suspense>
)
export default AppProvider
