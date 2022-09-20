import AppRoutes from '@/routes'
import AppProvider from '@/providers/app'

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
)

export default App
